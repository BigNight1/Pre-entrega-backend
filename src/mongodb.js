import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const dbConnect = async () => {
  mongoose
    .connect(process.env.DB_ECOMMERCE, {
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
