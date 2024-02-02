import CartManager from "./cartController.js";
import userModel from "../schemas/userSchema.js";
import RegisterDTO from "../../dtos/sessionDTOs/RegisterDTO.js";
import CustomError from "../../Error/CustomError.js";
import EErrors from "../../Error/enums.js";
import { generateUserErrorInfo } from "../../Error/info.js";
import { RegisterError } from "../../Error/registerError.js";
import { createHash, generateResetToken } from "../../middleware/security.js";
import { isValidPassword } from "../../middleware/security.js";
import MailingService from "../../services/mailing.js";

const cartManager = new CartManager();
const mailingService = new MailingService();

class UserManager {
  async registerUser(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const hashedPassword = createHash(password);
      const registerDTO = new RegisterDTO(
        first_name,
        last_name,
        email,
        age,
        hashedPassword
      );

      if (
        !registerDTO.first_name ||
        !registerDTO.last_name ||
        !registerDTO.email ||
        !registerDTO.age
      ) {
        throw new RegisterError("Datos incompletos"); // Lanza el error personalizado
      }

      const user = await userModel.create(registerDTO);
      // Crear un carrito de compras vacío y asociarlo al usuario
      const newCart = await cartManager.createCart(user._id);
      if (newCart) {
        // Asociar el carrito al usuario recién registrado
        user.cart = newCart._id;
        await user.save();
        req.logger.info(`Carrito creado y asociado a usuario: ${user._id}`);
      }
      req.logger.info("Usuario Creado Con exito y se le asigno un carrito");
      res.send({
        status: "success",
        message: "Usuario registrado",
        cart: newCart,
      });
    } catch (error) {
      if (error instanceof RegisterError) {
        // Manejar el error de registro personalizado aquí
        console.error("Error de registro:", error.message);
        return res.status(400).json({ status: "error", error: error.message });
      } else {
        // Manejar otros errores (por defecto, Error interno)
        console.error("Error al crear usuario:", error);
        return res
          .status(500)
          .json({ status: "error", error: "Error interno del servidor" });
      }
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        CustomError.createError({
          name: "User Invalid Error",
          cause: generateUserErrorInfo({ email, password }),
          message: "Invalid Credentials",
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      const user = await userModel.findOne(
        { email: email },
        {
          email: 1,
          first_name: 1,
          last_name: 1,
          password: 1,
          role: 1,
          age: 1,
          provider: 1,
          cart: 1,
        }
      );

      if (!user)
        return res.status(400).send({ status: "error", message: "Error User" });
      if (!isValidPassword(user, password))
        return res
          .status(400)
          .send({ status: "error", error: "Error credential" });

      if (user.role === "admin") {
        req.session.isAdmin = true;
      } else {
        req.session.isAdmin = false;
      }

      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
        provider: user.provider,
        cart: user.cart,
      };
      // Comprueba si el usuario tiene un carrito asociado
      if (!user.cart) {
        req.logger.debug(
          "El usuario no tiene un carrito existente. Creando uno nuevo..."
        );
        // Si no tiene un carrito, crea uno y asígnalo al usuario
        const newCart = await cartManager.createCart(user._id);
        if (newCart) {
          user.cart = newCart._id;
          await user.save();
          req.logger.info("Carrito creado y asignado al usuario:", newCart);
        } else {
          req.logger.debug("No se pudo crear el carrito para el usuario");
        }
      }

      res.send({
        status: "success",
        payload: req.session.user,
        message: "Logueado",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Error interno" });
    }
  }

  async logoutUser(req, res) {
    req.logout((err) => {
      if (err) {
        // Manejar el error
        return res
          .status(500)
          .send({ status: "error", message: "Error al cerrar sesión" });
      }
      req.session.destroy((err) => {
        if (err) {
          // Manejar el error
          return res
            .status(500)
            .send({ status: "error", message: "Error al cerrar sesión" });
        }
        res.send({ status: "success", message: "Sesión cerrada exitosamente" });
      });
    });
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const resetToken = generateResetToken(user._id);

      user.resetToken = resetToken;
      user.resetTokenExpires = new Date(Date.now() + 3600000);
      await user.save();

      const resetPasswordLink = `http://${req.headers.host}/changePassword/${resetToken}`;

      const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
        }
        h1 {
          color: #007bff;
        }
        p {
          color: #333;
        }
        .button {
          display: inline-block;
          font-size: 16px;
          padding: 10px 20px;
          text-decoration: none;
          background-color: #4CAF50;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <h1>Restablecer Contraseña</h1>
      <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
      <a href="${resetPasswordLink}" class="button">Restablecer Contraseña</a>
    </body>
  </html>
`;

      const correoEnviado = await mailingService.sendEmail(
        user.email,
        "Restablecer Contraseña",
        htmlContent
      );

      if (correoEnviado) {
        return res
          .status(200)
          .json({ message: "Correo electrónico enviado para restablecer" });
      } else {
        // Manejar el error si no se pudo enviar el correo
        return res
          .status(500)
          .json({ error: "Error al enviar el correo electrónico" });
      }
    } catch (error) {
      console.error(
        "Error al solicitar restablecimiento de contraseña:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async changePassword(req, res) {
    const token = req.params.token;
    const { newPassword } = req.body;

    try {
      const user = await userModel.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() },
      });
      if (!user) {
        return res.status(400).json({ error: "Token invalido o expirado" });
      }

      user.password = createHash(newPassword);
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
      res.status(200).json({ message: "Contraseña cambiada exitosamente" });
    } catch (error) {
      console.error("Error al cambiar la contraseña: ", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

export default UserManager;
