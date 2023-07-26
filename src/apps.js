import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ProductManager from "./dao/DB/productoManager.js";
import __dirname from "./utils.js";
import path from "path";
import mongoose from "mongoose";
import MessageManager from "./dao/DB/messagesManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager();
const messageManager = new MessageManager();
const DB_ECOMMERCE =
  "mongodb+srv://onemid76:1234@ecommerce.gjgde3d.mongodb.net/Ecommerce?retryWrites=true&w=majority";

// Conexion a la DB
mongoose
  .connect(DB_ECOMMERCE)
  .then(() => {
    console.log("Conectado con exito a la DB");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos:", error);
  });

// estructura codigo Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// Archivos Estaticos
app.use("/realtimeproducts", express.static(path.join(__dirname + "/public")));
app.use("/", express.static(path.join(__dirname + "/public")));

// Rutas del grupo /api/products
app.use("/api/products", productRoutes);

// Rutas del grupo /api/carts
app.use("/api/carts", cartRoutes);

// Ruta de la vista home
app.get("/", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("home", { productos });
});

// Ruta de la vista de productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("realTimeProducts", { productos });
});

//  Ruta de la vista de Chat
app.get("/chat", async (req,res)=>{
  const messages = await messageManager.getMessages();
  res.render("chat", {messages});
})

// Configuración del WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Enviar lista de productos en tiempo real al cliente
  socket.emit("realTimeProducts", productManager.getAllProducts());

  // Escuchar evento para crear un nuevo producto
  socket.on("createProduct", async (product) => {
    const newProduct = await productManager.createProduct(product);
    if (newProduct) {
      io.emit("realTimeProducts", await productManager.getAllProducts());
    }    
  });

  // Escuchar evento para eliminar un producto
  socket.on("deleteProduct", async (productId) => {
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      io.emit("realTimeProducts", await productManager.getAllProducts());
    }
  });

  // Escuchar eventos de Socket.IO para enviar y recibir mensajes
  socket.on("sendMessage", async (data) => {
    const { sender, content } = data;

    // Guardar el mensaje en la base de datos utilizando el administrador
    await messageManager.saveMessage(sender, content);

    // Enviar el mensaje recibido a todos los clientes conectados, incluyendo el remitente
    io.emit("receiveMessage", { sender, content });
  });

  // Configurar el evento para desconectar un usuario
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar el servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
