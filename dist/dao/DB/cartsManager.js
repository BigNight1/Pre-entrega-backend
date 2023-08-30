import { cartModel } from "../models/cartSchema.js";
import { productModel } from "../models/productSchema.js";
import mongoose from "mongoose";
class CartManager {
  async createCart() {
    try {
      return await cartModel.create({});
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      return null;
    }
  }
  async getCarts(limit) {
    try {
      let query = cartModel.find();
      if (limit) {
        query = query.limit(parseInt(limit));
      }
      return await query.populate('products').exec();
    } catch (error) {
      console.log("Error al obtener los carritos:", error);
      return [];
    }
  }
  async updateCart(cartId, products) {
    try {
      const result = await cartModel.findByIdAndUpdate(cartId, {
        products: products
      }, {
        new: true
      });
      return result;
    } catch (error) {
      console.log("Error al actualizar el carrito:", error);
      return null;
    }
  }
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      const productIndex = cart.products.findIndex(product => product._id.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }
      cart.products[productIndex].quantity = quantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.log('Error al actualizar la cantidad del producto en el carrito:', error);
      return null;
    }
  }
  async getCartById(cartId) {
    const productById = await cartModel.findById({
      _id: cartId
    }, {
      __v: false
    }).populate('products');
    return productById;
  }
  async deleteCart(cartId) {
    try {
      return await cartModel.findByIdAndDelete(cartId);
    } catch (error) {
      console.log("Error al eliminar el carrito:", error);
      return null;
    }
  }
  async removeFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return false;
      }
      const productIndex = cart.products.findIndex(product => product._id.toString() === productId);
      if (productIndex === -1) {
        return false;
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return true;
    } catch (error) {
      console.log("Error al eliminar el producto del carrito:", error);
      return null;
    }
  }
}
export default CartManager;