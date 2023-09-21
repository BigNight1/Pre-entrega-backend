import { v4 as uuidv4 } from 'uuid';
import { TicketModel } from '../schemas/TicketSchema.js';

export const TicketController = {
  generateUniqueCode: () => {
    return uuidv4(); 
  },

  calculateTotalAmount: (cart) => {
    let totalAmount = 0;
    for (const cartProduct of cart.products) {
      const { product, quantity } = cartProduct;
      // Recupera el precio del producto de alguna manera (depende de tu estructura de datos)
      const productPrice = getProductPrice(product);
      totalAmount += productPrice * quantity;
    }
    return totalAmount;
  },

  createTicket: async (cart, purchaser) => {
    const code = TicketController.generateUniqueCode();
    const amount = TicketController.calculateTotalAmount(cart);

    const ticket = new TicketModel({
      code,
      amount,
      purchaser,
    });

    await ticket.save();

    return ticket;
  },
};
