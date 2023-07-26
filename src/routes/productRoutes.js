import express from "express";
import ProductManager from "../dao/DB/productoManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.json(products);
  } catch (error) {
    console.log("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productManager.getProductById(productId);

    if (product) {
      res.render("productDetails", { product });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.log("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const createdAt = new Date();
    if (!name || !price || !description || !category || !createdAt) {
      return res.status(400).json({ error: "Falta llenar un campo" });
    }
    const newProduct = {
      name,
      price,
      description,
      category,
      createdAt,
    };

    const product = await productManager.createProduct(newProduct);

    res.status(201).json({ message: "Producto agregado con éxito", product });
  } catch (error) {
    console.log("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = req.body;

    if (
      !updatedProduct.name ||
      !updatedProduct.price ||
      !updatedProduct.description ||
      !updatedProduct.category ||
      !updatedProduct.createdAt
    ) {
      return res.status(400).json({ error: "Falta llenar un campo" });
    }

    const product = await productManager.updateProduct(
      productId,
      updatedProduct
    );

    res.json({ message: "Producto actualizado con éxito", product });
  } catch (error) {
    console.log("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      res.json({ message: "Producto eliminado con éxito", productId });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.log("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
