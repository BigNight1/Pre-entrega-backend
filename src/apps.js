import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import mongoose from "mongoose";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ProductManager from "./dao/DB/productoManager.js";
import CartManager from "./dao/DB/cartsManager.js";
import MessageManager from "./dao/DB/messagesManager.js";
import dotenv from "dotenv";

// configuracion de dotevn
dotenv.config({ path: ".env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cartManager = new CartManager();
const productManager = new ProductManager();
const messageManager = new MessageManager();

// Conexion a la DB
mongoose
  .connect(process.env.DB_ECOMMERCE)
  .then(() => {
    console.log("Conectado con exito a la DB");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos:", error);
  });

// estructura codigo Handlebars y archivo Estatico
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/realtimeproducts", express.static(path.join(__dirname + "/public")));
app.use("/", express.static(path.join(__dirname + "/public")));

// Rutas del grupo
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Rutas de Visualización 
app.get("/", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("home", { productos });
});
app.get("/realtimeproducts", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("realTimeProducts", { productos });
});
app.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", { messages });
});
app.get("/cart", async(req,res)=>{
  res.render("cart")
})

// Configuración del WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.emit("realTimeProducts", productManager.getAllProducts());

  socket.on("createProduct", async (product) => {
    try {
      const newProduct = await productManager.createProduct(product);
      if (newProduct) {
        io.emit("realTimeProducts", await productManager.getAllProducts());
      }
    } catch (error) {
      console.log("Error al crear el producto:", error);
      socket.emit("productResponse", {
        error: "Error al crear el producto",
      });
    }
  });
  

  socket.on("deleteProduct", async (productId) => {
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      io.emit("realTimeProducts", await productManager.getAllProducts());
    }
  });

  socket.on("sendMessage", async (data) => {
    const { sender, content } = data;

    await messageManager.saveMessage(sender, content);

    io.emit("receiveMessage", { sender, content });
  });

  socket.on("addToCart", async ({ cartId , productId }) => {
    
    const addedToCart = await cartManager.addToCart(cartId, productId);

    if (addedToCart) {
      socket.emit("addToCartResponse", { success: true });
    } else {
      socket.emit("addToCartResponse", {
        error: "No se pudo agregar el producto al carrito",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar el servidor
server.listen(process.env.port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${process.env.port}`);
});
