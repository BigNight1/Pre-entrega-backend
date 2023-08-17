import { Router } from "express";
import userModel from "../dao/models/userSchema.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await userModel.findOne({ email });

  if (exist)
    return res
      .status(400)
      .send({ status: "error", error: "Users already exists" });

  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
  };
  let result = await userModel.create(user);
  res.send({ status: "success", message: "User Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, password });

  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "Incorrect credentials" });

  if(user.role === "admin"){
    req.session.isAdmin = true
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

router.post("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log("Error in logging out",err)
      return res.status(500).send({status:"error", message:"Error al Cerrar la sesión"})
    }
    res.send({status:"success", message: "Sesion Cerrada exitosamente"})
  })
})

export default router;
