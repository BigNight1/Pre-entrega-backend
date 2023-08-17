import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'products' }
  ],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
