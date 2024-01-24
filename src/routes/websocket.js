import { Server } from "socket.io";
import ProductManager from "../dao/Controller/productoController.js";
import MessageManager from "../dao/Controller/messagesController.js";
import CartManager from "../dao/Controller/cartController.js";

const setupWebSocket = (server) => {
  const io = new Server(server);
  const productManager = new ProductManager();
  const messageManager = new MessageManager();
  const cartController = new CartManager();

  io.on("connection", (socket) => {
    socket.emit("realTimeProducts", productManager.getAllProducts());

    // Create, Update and Delete Products
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

    socket.on("updateProduct", async (updatedProduct) => {
      try {
        const updated = await productManager.updateProduct(updatedProduct);
        if (updated) {
          io.emit("realTimeProducts", await productManager.getAllProducts());
        }
      } catch (error) {
        console.log("Error al actualizar el producto:", error);
        socket.emit("productResponse", {
          error: "Error al actualizar el producto",
        });
      }
    });

    socket.on("deleteProduct", async (productId) => {
      const deletedProduct = await productManager.deleteProduct(productId);
      if (deletedProduct) {
        io.emit("realTimeProducts", await productManager.getAllProducts());
      }
    });

    // send Messages
    socket.on("sendMessage", async (data) => {
      const { sender, content } = data;
      await messageManager.saveMessage(sender, content);
      io.emit("receiveMessage", { sender, content });
    });

    
  });
};

export default setupWebSocket;
