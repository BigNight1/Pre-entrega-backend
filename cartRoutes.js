import express from "express";
const router = express.Router();

let carts = [];

router.get("/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = carts.find((cart) => cart.id === cartId);

    if (cart) {
      res.json({
        message: "Productos del carrito obtenidos con éxito",
        products: cart.products,
      });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = carts.find((cart) => cart.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find(
        (product) => product.id === productId
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      res.json({ message: "Producto agregado al carrito con éxito" });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;

