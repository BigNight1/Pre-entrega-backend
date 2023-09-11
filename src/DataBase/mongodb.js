import mongoose from "mongoose";
import CONFIG from "../config/config.js";

export const dbConnect = async () => {
  mongoose
    .connect(CONFIG.DB_ECOMMERCE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Conectado con exito a la DB");
    })
    .catch((error) => {
      console.log("Error al conectar a la base de datos:", error);
    });
};