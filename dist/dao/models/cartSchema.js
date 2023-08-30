import mongoose from "mongoose";
const cartCollection = "carts";
const cartSchema = mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  }]
});
export const cartModel = mongoose.model(cartCollection, cartSchema);

// analizar el carrito y el populate