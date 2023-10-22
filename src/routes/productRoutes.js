import express  from "express";
import {Router} from "express";
import ProductManager from "../dao/Controller/productoController.js";
import { productModel } from "../dao/schemas/productSchema.js";
// DTOs
import ProductDTO from "../dtos/ProductDTOs/ProductDTO.js";
import ProductUpdateDTO from "../dtos/Productdtos/ProductUpdateDTO.js";
import ProductQueryDTO from "../dtos/ProductDTOs/ProductQueryDTO.js";

const router = Router();
const productManager = new ProductManager();

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category } = req.query;
    const queryDTO = new ProductQueryDTO(limit, page, sort, category);
    const result = await productModel.paginate(
      { category: queryDTO.category },
      {
        limit: queryDTO.limit,
        page: queryDTO.page,
        sort: { price: queryDTO.sort },
      }
    );
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los productos" });
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
    const { name, price, description, category,stock } = req.body;
    const productData = new ProductDTO(name, price, description, category,stock);
    const product = await productManager.createProduct(productData);

    res.status(201).json({ message: "Producto agregado con éxito", product });
  } catch (error) {
    console.log("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, description, category } = req.body;
    const updateProductData = new ProductUpdateDTO(
      name,
      price,
      description,
      category
    );
    const product = await productManager.updateProductId(
      productId,
      updateProductData
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
