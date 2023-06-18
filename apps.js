import express from "express";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";

const app = express();

app.use(express.json());

// Rutas del grupo /api/products
app.use("/api/products", productRoutes);

// Rutas del grupo /api/carts
app.use("/api/carts", cartRoutes);

app.listen(8080, () => {
  console.log("Servidor en funcionamiento en el puerto 8080");
});
