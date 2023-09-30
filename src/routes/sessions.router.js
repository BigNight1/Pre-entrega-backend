// Dependencias
import passport from "passport";
import { Router } from "express";

// Importaciones Locales
import { loginUser } from "../Controller-User/loginUser.js";
import { registerUser } from "../Controller-User/registerUser.js";
import { logoutUser } from "../Controller-User/LogoutUser.js";
import { restartpassword } from "../Controller-User/restartUser.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/restartpassword", restartpassword); 

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
