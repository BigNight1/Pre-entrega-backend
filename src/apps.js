import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ProductManager from "./controllers/TerceraPre.js";
import __dirname from "./utils.js";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager();
const productos = productManager.getProducts();

// estructura codigo Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// Archivos Estaticos
app.use("/realtimeproducts", express.static(path.join(__dirname + '/public')));
app.use("/", express.static(path.join(__dirname + '/public')));
// Rutas del grupo /api/products
app.use("/api/products", productRoutes);

// Rutas del grupo /api/carts
app.use("/api/carts", cartRoutes);

// Ruta de la vista home
app.get("/", (req, res) => {
  res.render("home", { productos });
});

// Ruta de la vista de productos en tiempo real
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { productos });
});

// Configuración del WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Enviar lista de productos en tiempo real al cliente
  socket.emit("realTimeProducts", productManager.getProducts());
  
  // Escuchar evento para crear un nuevo producto
  socket.on("createProduct", (product) => {
    productManager.addProduct(product);
    io.emit("realTimeProducts", productManager.getProducts());
  });

  // Escuchar evento para eliminar un producto
  socket.on("deleteProduct", (productId) => {
    productManager.deleteProduct(productId);
    io.emit("realTimeProducts", productManager.getProducts());
  });
});

// Iniciar el servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
