import express from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/TerceraPre.js";


const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  res.json(newCart);
});

// Crear un nuevo carrito
router.post("/:cartId/products/:productId", (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);

  const added = cartManager.addToCart(cartId, productId);
  if (added) {
    const product = productManager.getProductsById(productId);
    if (product) {
      const cart = cartManager.getCartById(cartId);
      res.json({
        message: "Producto agregado al carrito",
        product,
        cart,
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Eliminar un producto del carrito
router.delete("/:cartId/products/:productId", (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const productId = parseInt(req.params.productId);
  const removed = cartManager.removeFromCart(cartId, productId);
  if (removed) {
    res.json({ message: "Producto eliminado del carrito" });
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Obtener información de un carrito específico
router.get("/:cartId", (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

export default router;
