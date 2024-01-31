  import mongoose from "mongoose";
  import CONFIG from "../config/config.js";
  import {createDBError} from "../Error/dbError.js"

  export const dbConnect = async (req,res) => {
    mongoose
      .connect(CONFIG.DataBase.DB_ECOMMERCE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Conectado con exito a la DB");
      })
      .catch((error) => {
        throw createDBError("Error al conectar a la base de datos:", error);
      });
  };