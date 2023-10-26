import express from "express";
import CartManager from "../dao/Controller/cartController.js";
import ProductManager from "../dao/Controller/productoController.js";
import requireAuth from "../middleware/requireAuth.js";
import { TicketController } from "../dao/Controller/TicketController.js";

const router = express.Router();
const cartManager = new CartManager();
const productmanager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    res.send(await cartManager.getCarts(limit));
  } catch (err) {
    res.status(500).send(err.message);
    const error = err.message;
    req.logger.debug(error);
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
    req.logger.debug(error);
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
    req.logger.debug(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart({});
    res.json(newCart);
  } catch (error) {
    req.logger.debug("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.post("/:cartId/products/:productId", requireAuth, async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const quantityToAdd = req.body.quantity || 1;

    const cart = await cartManager.getCartById(cartId);
    const product = await productmanager.getProductById(productId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const existingProductIndex = cart.products.findIndex(
      (cartProduct) => cartProduct.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantityToAdd;
    } else {
      cart.products.push({ product: productId, quantity: quantityToAdd });
    }

    await cart.save();

    res.json({ message: "Producto agregado al carrito", product, cart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.stack);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

router.post("/:cartId/purchase", async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const totalAmount = await TicketController.calculateTotalAmount(cart);

    for (const cartProduct of cart.products) {
      const { product, quantity } = cartProduct;
      const productObject = await productmanager.getProductById(product);

      if (productObject && productObject.stock >= quantity) {
        productObject.stock -= quantity;
        await productObject.save();
      } else {
        return res.status(400).json({
          error: `No hay suficiente stock para: ${productObject.name}`,
        });
      }
    }
    // Después de completar la compra, elimina todos los productos del carrito
    cart.products = [];

    const purchaser = cart.user;

    const ticket = await TicketController.createTicket(
      purchaser,
      totalAmount
    );

    await cart.save();
    req.logger.info("Compra finalizada con éxito")
    console.log("Compra finalizada con éxito");

    res.json({
      message: "Compra finalizada con éxito",
      cart,
      ticket,
    });
  } catch (error) {
    console.error("Error en la compra:", error.stack);
    res.status(500).json({ error: "Error en la compra" });
  }
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
