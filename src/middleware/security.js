import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const SECRET_KEY = "top-secret-51";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateResetToken = (userId, token)=>{
  try{
    const token = jwt.sign({userId}, SECRET_KEY, {expiresIn: "1h"})
    return token
  }catch(error){
    console.error("Error al generar el token de restablecimiento",error);
    throw new Error("Error al geneerar el token de restablecimiento")
  }
}

// export const verifyResetToken = (userId, token)=>{
//   try{
//     const decoded = jwt.verify(token, SECRET_KEY);
//     return decoded.userId === userId
//   }catch(error){
//     console.error("Error al verificar el token de restablecimiento:", error)
//     return false
//   }
// }

export const authToken = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  if (!headerAuth)
    return res
      .status(401)
      .send({ status: "error", error: "No esta autorizado" });
  console.log(headerAuth);
  const token = headerAuth.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (error, credentials) => {
    console.log(error);
    if (error)
      return res
        .status(401)
        .send({ status: "error", error: "No esta autorizado" });
    req.user = credentials.user;
    next();
  });
};
