import express from "express";
import { productModel } from "../dao/models/productSchema.js";
import CartManager from "../dao/Controller/cartController.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    res.send(await cartManager.getCarts(limit));
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

router.put("/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const products = req.body;
    await cartManager.updateCart(cartId, products);
    res.status(200).send({
      message: "Cart products updated",
      products,
    });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

router.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const result = await cartManager.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    res.status(200).send({
      message: "Producto actualizado en la lista de compras",
      acknowledged: result.acknowledged,
    });
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    console.log(error);
  }
});

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
  const quantityToAdd = req.body.quantity || 1

  const cart = await cartManager.getCartById(cartId);
  const product = await productModel.findById(productId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const existingProduct = cart.products.find(
    (cartProduct) => cartProduct.product.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += quantityToAdd;
  } else {
    cart.products.push({ product: productId, quantity: quantityToAdd });
  }

  await cart.save();

  res.json({ message: "Producto agregado al carrito", product, cart });
});

router.delete("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const cart = await cartManager.getCartById(cartId);
  const productExists = await cartManager.removeFromCart(cartId, productId);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  if (!productExists) {
    return res
      .status(404)
      .json({ error: "Producto no encontrado en el carrito" });
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
