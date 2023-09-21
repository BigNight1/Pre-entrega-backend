import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/schemas/userSchema.js";
import RegisterDTO from "../dtos/sessionDTOs/RegisterDTO.js";
import CartManager from "../dao/Controller/cartController.js";

const router = Router();
const cartManager = new CartManager();

router.post("/register", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ status: "error", error: "Error User" });

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
    return res.status(400).send({ status: "error", error: "Error credential" });

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
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error in logging out", err);
      return res
        .status(500)
        .send({ status: "error", message: "Error al Cerrar la sesión" });
    }
    res.send({ status: "success", message: "Sesion Cerrada exitosamente" });
  });
});

router.post("/restartpassword", async (req, res) => {
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
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    req.session.user = req.user;
    if (req.user && req.user.role === "admin") {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }

    res.redirect("/profile");
  }
);

export default router;
