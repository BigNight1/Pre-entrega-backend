import { createHash } from "../utils.js";
import CartManager from "../dao/Controller/cartController.js";
import userModel from "../dao/schemas/userSchema.js";
import RegisterDTO from "../dtos/sessionDTOs/RegisterDTO.js";

const cartManager = new CartManager();

export const registerUser = async (req, res) => {
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
      return res
        .status(400)
        .json({ status: "error", error: "Datos incompletos" });
    }

    const user = await userModel.create(registerDTO);

    // Crear un carrito de compras vacío y asociarlo al usuario
    const newCart = await cartManager.createCart(user._id);
    if (newCart) {
      // Asociar el carrito al usuario recién registrado
      user.cart = newCart._id;
      await user.save();
      console.log(`Carrito creado y asociado a usuario: ${user._id}`);
    }

    res.send({
      status: "success",
      message: "Usuario registrado",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};
