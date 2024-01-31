import { v4 as uuidv4 } from "uuid";
import { TicketModel } from "../schemas/TicketSchema.js";
import ProductManager from "./productoController.js";

const productmanager = new ProductManager();

export const TicketController = {
  generateUniqueCode: () => {
    return uuidv4();
  },

  calculateTotalAmount: async (cart) => {
    let totalAmount = 0;

    for (const cartProduct of cart.products) {
      const { product, quantity } = cartProduct;
      const productObject = await productmanager.getProductById(product);

      if (!productObject || productObject.stock < quantity) {
        throw new Error(`No hay suficiente stock para: ${productObject?.name}`);
      }

      const productPrice = productObject.price;
      totalAmount += productPrice * quantity;

    }

    return totalAmount;
  },

  createTicket: async (purchaser, totalAmount) => {
    const code = TicketController.generateUniqueCode();

    const ticket = new TicketModel({
      code,
      amount: totalAmount,
      purchaser,
    });

    try {
      await ticket.save();
      console.log("Ticket guardado con éxito:", ticket);
    } catch (error) {
      console.error("Error al guardar el ticket:", error);
      throw error;
    }

    return ticket;
  },
};
