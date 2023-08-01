import { cartModel } from "../models/cartSchema.js";
import { productModel } from "../models/productSchema.js";

class CartManager {
  async createCart() {
    try {
      const newCart = await cartModel.create({});
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      return null;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findById(cartId).populate("products");
      return cart;
    } catch (error) {
      console.log("Error al obtener el carrito:", error);
      return null;
    }
  }

  async addToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return false;
      }

      const product = await productModel.findById(productId);
      if (!product) {
        return false;
      }

      cart.products.push(product);
      await cart.save();

      return true;
    } catch (error) {
      console.log("Error al agregar el producto al carrito:", error);
      return null;
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(cartId);
      return deletedCart;
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

      const productIndex = cart.products.findIndex(
        (product) => product.toString() === productId
      );
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
