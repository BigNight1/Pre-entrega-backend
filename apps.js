import express from "express";
import ProductManager from "./TerceraPre.js";

const nuevoProducto = new ProductManager();
const app = express();

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await nuevoProducto.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});


app.get("/products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = nuevoProducto.getProductsById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

app.listen(8080, () => {
  console.log("Servidor en funcionamiento en el puerto 8080");
});