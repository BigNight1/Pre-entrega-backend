// Dependencias
import passport from "passport";
import { Router } from "express";

// Importaciones Locales
import UserManager from "../dao/Controller/userController.js";

// Controladores
const userManager = new UserManager();
const router = Router();

router.post("/register", userManager.registerUser);

router.post("/login", userManager.loginUser);

router.post("/logout", userManager.logoutUser);

router.post("/restartpassword", userManager.restartpassword);

router.get ("/restablecer-contraseña:token")

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
