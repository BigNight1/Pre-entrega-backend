import express from "express";
import ProductManager from "./TerceraPre.js";

const nuevoProducto = new ProductManager();
const app = express();
const routerProducts = express.Router();
const routerCarts = express.Router();

app.use(express.json());

// Rutas del grupo /api/products

routerProducts.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await nuevoProducto.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

routerProducts.get("/:pid", (req, res) => {
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

routerProducts.post("/", (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const product = {
      id: nuevoProducto.generateProductId(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    nuevoProducto.addProduct(product);
    nuevoProducto.writeFileProduct();

    res.status(201).json({ message: "Producto agregado con éxito", product });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

routerProducts.put("/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const productData = req.body;

    const updatedProduct = nuevoProducto.updateProduct(productId, productData);
    if (updatedProduct) {
      res.json({ message: "Producto actualizado con éxito", product: updatedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

routerProducts.delete("/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    const deletedProduct = nuevoProducto.deleteProduct(productId);
    if (deletedProduct) {
      res.json({ message: "Producto eliminado con éxito", product: deletedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

routerCarts.get("/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;

    res.json({ message: "Productos del carrito obtenidos con éxito", products });
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

routerCarts.post("/:cid/product/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    res.json({ message: "Producto agregado al carrito con éxito" });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(8080, () => {
  console.log("Servidor en funcionamiento en el puerto 8080");
});