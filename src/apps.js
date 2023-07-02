import express from "express";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

// Rutas del grupo /api/products
app.use("/api/products", productRoutes);

// Rutas del grupo /api/carts
app.use("/api/carts", cartRoutes);

app.listen(8080, () => {
  console.log("Servidor en funcionamiento en el puerto 8080");
});
