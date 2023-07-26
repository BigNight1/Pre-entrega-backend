import express from "express";
import { productModel } from "../dao/models/productSchema.js";
import CartManager from "../dao/DB/cartsManager.js";


const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.create({});
    res.json(newCart);
  } catch (error) {
    console.log("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.post("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartManager.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    cart.products.push(product);
    await cart.save();

    res.json({ message: "Producto agregado al carrito", product, cart });
  } catch (error) {
    console.log("Error al agregar el producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

router.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartManager.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.log("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

router.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartManager.findById(cartId).populate("products");
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    console.log("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

export default router;
