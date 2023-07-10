import express from "express";
import ProductManager from "../controllers/TerceraPre.js";

const router = express.Router();
const nuevoProducto = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await nuevoProducto.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = nuevoProducto.getProductsById(productId);

  if (product) {
    res.render("productDetails", { product });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.get("/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
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

router.post("/", (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return res.status(400).json({ error: "Falta llenar un campo" });
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    nuevoProducto.addProduct(newProduct);

    res
      .status(201)
      .json({ message: "Producto agregado con éxito", newProduct });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;

    if (
      !updatedProduct.title ||
      !updatedProduct.description ||
      !updatedProduct.price ||
      !updatedProduct.thumbnail ||
      !updatedProduct.code ||
      !updatedProduct.stock
    ) {
      return res.status(400).json({ error: "Falta llenar un campo" });
    }

    nuevoProducto.updateProduct(productId, updatedProduct);

    res.json({ message: "Producto actualizado con éxito", updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    nuevoProducto.deleteProduct(productId);

    res.json({ message: "Producto eliminado con éxito", productId });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
