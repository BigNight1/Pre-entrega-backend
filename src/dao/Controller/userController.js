import CartManager from "./cartController.js";
import userModel from "../schemas/userSchema.js";
import RegisterDTO from "../../dtos/sessionDTOs/RegisterDTO.js";
import CustomError from "../../Error/CustomError.js";
import EErrors from "../../Error/enums.js";
import { generateUserErrorInfo } from "../../Error/info.js";
import { RegisterError } from "../../Error/registerError.js";
import { createHash } from "../../middleware/security.js";
import { isValidPassword } from "../../middleware/security.js";

const cartManager = new CartManager();

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
      req.logger.info("Usuario Creado Con exito y se le asigno un carrito")
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
    req.session.destroy((err) => {
      if (err) {
        req.logger.info("Error in logging out", err);
        return res
          .status(500)
          .send({ status: "error", message: "Error al Cerrar la sesión" });
      }
      res.send({ status: "success", message: "Sesion Cerrada exitosamente" });
    });
  }

  async restartpassword(req, res){
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete Values" });
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).send({ status: "error", error: "Not user found" });
    const newHashedPassword = createHash(password);
    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );
  
    res.send({ status: "success", message: "Contraseña restaurada" });
  };
  
}

export default UserManager;
