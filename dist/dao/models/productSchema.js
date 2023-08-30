import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection = 'products';
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productCollection, productSchema);