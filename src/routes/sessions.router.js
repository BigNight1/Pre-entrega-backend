import { Router } from "express";
import userModel from "../dao/models/userSchema.js";
import { createHast , isValidPassword} from "../utils.js"
import passport from "passport"

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
    password: createHast(password),
  };
  let result = await userModel.create(user);
  res.send({ status: "success", message: "User Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password)
    return res.status(400).send({status:"error", error:"Error User"})

  const user = await userModel.findOne({ email:email}, {email:1,first_name:1, last_name:1,password:1 });

  if (!user)
    return res.status(400).send({ status: "error", message: "Error User" });
  if(!isValidPassword(user,password))
    return res.status(400).send({status:"error", error:"Error credential"})
  if(user.role === "admin"){
    req.session.isAdmin = true
  }
      
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };
  res.send({status: "success",payload: req.session.user,message: "Logueado",});
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

router.post("/restartpassword",async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  const user = await userModel.findOne({email});
  if(!user) return res.status(404).send({status:"error",error:"Not user found"});
  const newHashedPassword = createHast(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});

  res.send({status:"success",message:"Contraseña restaurada"});
})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
  req.session.user=req.user
  res.redirect('/login')
})


export default router;
