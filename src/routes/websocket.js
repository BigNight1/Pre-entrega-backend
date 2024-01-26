import { Server } from "socket.io";
import ProductManager from "../dao/Controller/productoController.js";
import MessageManager from "../dao/Controller/messagesController.js";

const setupWebSocket = (server) => {
  const io = new Server(server);
  const productManager = new ProductManager();
  const messageManager = new MessageManager();

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

    // search product and delete
    socket.on("deleteProduct", async (productName) => {
      try {
        // Buscar el producto por el nombre
        const productToDelete = await productManager.getProductByName(
          productName
        );

        if (!productToDelete) {
          console.error("Producto no encontrado");
          socket.emit("deleteProductResponse", {
            success: false,
            message: "Producto no encontrado",
          });
          return;
        }

        // Si el producto se encuentra, proceder con la eliminación
        const deletedProduct = await productManager.deleteProduct(productName);

        if (deletedProduct) {
          io.emit("realTimeProducts", await productManager.getAllProducts());
          console.log("Producto eliminado correctamente");
          socket.emit("deleteProductResponse", {
            success: true,
            message: "Producto eliminado correctamente",
          });
        } else {
          console.error("Error al eliminar el producto");
          socket.emit("deleteProductResponse", {
            success: false,
            message: "Error al eliminar el producto",
          });
        }
      } catch (error) {
        console.error("Error al procesar la eliminación del producto:", error);
        socket.emit("deleteProductResponse", {
          success: false,
          message: "Error interno al procesar la eliminación del producto",
        });
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
