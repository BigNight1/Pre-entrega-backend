// ......Dependencias
import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import path from "path";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sessionRouter from "./routes/sessions.router.js";
import viewRouter from "./routes/views.router.js";
import ProductManager from "./dao/DB/productoManager.js";
import CartManager from "./dao/DB/cartsManager.js";
import MessageManager from "./dao/DB/messagesManager.js";
import { productModel } from "./dao/models/productSchema.js";
import { dbConnect } from "./mongodb.js";
import MongoStore from "connect-mongo";
import session from "express-session";

// configuracion de dotevn
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cartManager = new CartManager();
const productManager = new ProductManager();
const messageManager = new MessageManager();

// estructura codigo Handlebars y archivo Estatico
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/realtimeproducts", express.static(path.join(__dirname + "/public")));
app.use("/", express.static(path.join(__dirname + "/public")));

app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.DB_ECOMMERCE,
      ttl: 3600,
    }),
    secret: "CoderSecretSHHHHH",
    resave: false,
    saveUninitialized: false,
  })
);

// Rutas del grupo
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewRouter);
app.use("/api/sessions", sessionRouter);

// Conectarse A servidor
dbConnect();

// Inicializa Passport con tu estrategia de autenticación

// Rutas de Visualización
app.get("/products", async (req, res) => {
  const isAuthenticated = req.session.user ? true : false;
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit, page, lean: true });
  const products = docs;
  res.render("home", {
    isAuthenticated,
    products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  });
});
app.get("/realtimeproducts", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("realTimeProducts", { productos });
});
app.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", { messages });
});

app.get("/carts/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    console.log("Carrito no encontrado");
    return res.status(404).send("Carrito no encontrado");
  }

  console.log(cart);
  res.render("cartDetails", { cart });
});

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

  // socket.on("addToCart", async ({ cartId, productId }) => {
  //   console.log("Recibiendo addToCart:", cartId, productId);
  //   const addedToCart = await cartManager.addToCart(cartId, productId);

  //   if (addedToCart) {
  //     socket.emit("addToCartResponse", { success: true });
  //   } else {
  //     socket.emit("addToCartResponse", {
  //       error: "No se pudo agregar el producto al carrito",
  //     });
  //   }

  // });
  // falta arreglar este codigo quiero  saber porque el id del carrito no esta llegando

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});

// Iniciar el servidor
server.listen(process.env.port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${process.env.port}`);
});
