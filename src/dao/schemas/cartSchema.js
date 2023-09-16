import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    required: true,
    default: [],
  },
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
