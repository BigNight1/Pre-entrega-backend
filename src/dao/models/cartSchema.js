import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // Cambiado de "products" a "product"
        },
        quantity: {
          type: Number,
          default: 1
        },
      },
    ],
    required: true,
    default: [],
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);


// analizar el carrito y el populate