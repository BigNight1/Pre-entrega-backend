import userModel from "../schemas/userSchema.js";
import { cartModel } from "../schemas/cartSchema.js";

// Función para registrar un nuevo usuario
async function registerUser(req, res) {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Crear un nuevo carrito vacío
    const newCart = await cartModel.create({ user: null, products: [] });

    // Crear un nuevo usuario y asociarlo al carrito creado
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      cart: newCart._id, // Asociar el ID del carrito al usuario
    });

    // Asociar el carrito al usuario (también podrías hacer esto después de crear el usuario)
    newCart.user = newUser._id;
    await newCart.save();

    res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

export { registerUser };
