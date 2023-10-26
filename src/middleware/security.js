import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const SECRET_KEY= "top-secret-51"

export const createHash = password=> bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user,password) =>bcrypt.compareSync(password,user.password)

export const generateToken = (user) => {
  const token = jwt.sign({ ...user }, SECRET_KEY, { expiresIn: "12h" });
  return token;
};

export const authToken = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  if (!headerAuth)
    return res
      .status(401)
      .send({ status: "error", error: "No esta autorizado" });
  console.log(headerAuth);
  const token = headerAuth.split("")[1];
  jwt.verify(token, KEY, (error, credentials) => {
    console.log(error);
    if (error)
      return res
        .status(401)
        .send({ status: "error", error: "No esta autorizado" });
    req.user = credentials.user;
    next();
  });
};

