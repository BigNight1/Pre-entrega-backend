import express from "express";
import { productModel } from "../dao/models/productSchema.js";
import CartManager from "../dao/DB/cartsManager.js";

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart({});
    res.json(newCart);
  } catch (error) {
    console.log("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.post("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const cart = await cartManager.getCartById(cartId);
  const product = await productModel.findById(productId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  cart.products.push(product);
  await cart.save();

  res.json({ message: "Producto agregado al carrito", product, cart });
});

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

router.delete("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const cart = await cartManager.getCartById(cartId);
  const productExists = await cartManager.removeFromCart(cartId, productId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (!productExists) {
    return res.status(404).json({ error: "Producto no encontrado en el carrito" });
  }

  res.json({ message: "Producto eliminado del carrito" });
});

router.delete("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  await cartManager.deleteCart(cartId);
  res.json({ message: "Carrito eliminado con éxito" });
});

export default router;

