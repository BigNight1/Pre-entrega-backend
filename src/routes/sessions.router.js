import passport from "passport";
import { Router } from "express";

import { createHash } from "../utils.js";
import { loginUser } from "../Controller-User/loginUser.js";
import { logoutUser } from "../Controller-User/LogoutUser.js";
import { registerUser } from "../Controller-User/registerUser.js";
import userModel from "../dao/schemas/userSchema.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

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
