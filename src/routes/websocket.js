import { Server } from "socket.io";
import ProductManager from "../dao/DB/productoManager.js";
import MessageManager from "../dao/DB/messagesManager.js";

const setupWebSocket = (server) => {
  const io = new Server(server);
  const productManager = new ProductManager();
  const messageManager = new MessageManager();

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
};

export default setupWebSocket;
