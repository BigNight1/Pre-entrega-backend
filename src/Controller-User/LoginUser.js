import CustomError from "../Error/customError.js";
import EErrors from "../Error/enums.js";
import { generateUserErrorInfo } from "../Error/info.js";
import CartManager from "../dao/Controller/cartController.js";
import userModel from "../dao/schemas/userSchema.js";
import { isValidPassword } from "../utils.js";

const cartManager = new CartManager()

export const loginUser = async (req, res) => {
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
      console.log(
        "El usuario no tiene un carrito existente. Creando uno nuevo..."
      );
      // Si no tiene un carrito, crea uno y asígnalo al usuario
      const newCart = await cartManager.createCart(user._id);
      if (newCart) {
        user.cart = newCart._id;
        await user.save();
        console.log("Carrito creado y asignado al usuario:", newCart);
      } else {
        console.log("No se pudo crear el carrito para el usuario");
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
};
