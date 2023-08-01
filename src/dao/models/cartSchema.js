import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: [
    {
      name: String,
      price: Number,
      description: String,
      category: String,
      createdAt: Date,
      quantity: Number,
    },
  ],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
