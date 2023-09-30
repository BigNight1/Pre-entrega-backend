import express from "express";
import ProductManager from "../dao/Controller/productoController.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/mockingproducts", async (req, res) => {
  try {
    const mockProducts = [];

    for (let i = 1; i <= 2; i++) {
      const newProduct = {
        name: `Producto de prueba ${i}`,
        price: Math.floor(Math.random() * 100) + 1,
        description: `Descripción del producto de prueba ${i}`,
        category: "Categoría de prueba",
        stock: Math.floor(Math.random() * 100) + 1,
      };
      mockProducts.push(newProduct);
    }
    const insertedProducts = await productManager.bulkInsertProducts(
      mockProducts
    );
    res.json({
      message: "Productos de prueba generados con éxito",
      mockProducts: insertedProducts,
    });
  } catch (error) {
    console.error("Error al generar productos de prueba:", error);
    res.status(500).json({ error: "Error al generar productos de prueba" });
  }
});

export default router 