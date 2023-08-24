import { Router } from "express";
import passport from "passport";
import { createHast, isValidPassword } from "../utils.js";
import GithubUser from "../dao/models/githubUserschema.js";
import userModel from "../dao/models/userSchema.js";

const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if (!first_name || !last_name || !email || !age)
    return res.status(400).send({ status: "error", error: "Error User" });
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHast(password),
  };
  let result = await userModel.create(user);
  res.send({ status: "success", message: "User Registered" });
});

router.get(
  "/register/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/register/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/register",
  }),
  async (req, res) => {
    const { accountId, name, provider } = req.user; // Obtener los campos necesarios
    req.session.user = {
      accountId,
      name,
      provider,
    };
    res.redirect("/");
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ status: "error", error: "Error User" });

  const user = await userModel.findOne(
    { email: email },
    { email: 1, first_name: 1, last_name: 1, password: 1 }
  );

  if (!user)
    return res.status(400).send({ status: "error", message: "Error User" });
  if (!isValidPassword(user, password))
    return res.status(400).send({ status: "error", error: "Error credential" });
  if (user.role === "admin") {
    req.session.isAdmin = true;
  }

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };
  res.send({
    status: "success",
    payload: req.session.user,
    message: "Logueado",
  });
});

router.get(
  "/login/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/login/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const { id, username, provider } = req.user; // Obtener los campos necesarios
    req.session.user = {
      accountId: id,
      name: username,
      provider,
    };
    res.redirect("/");
  }
);

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
  const newHashedPassword = createHast(password);
  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: newHashedPassword } }
  );

  res.send({ status: "success", message: "Contraseña restaurada" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    const { id, username, provider } = req.user; // Solo selecciona los campos esenciales
    req.user = {
      accountId: id,
      name: username,
      provider: provider,
    };
    res.redirect("/");
  }
);


export default router;
