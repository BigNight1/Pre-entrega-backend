import { writeFileSync, readFileSync, existsSync } from "fs";
import ProductManager from "../managers/TerceraPre.js";

const productManager = new ProductManager();

class CartManager {
  carts;
  cartFile = "carts.json"; // Nombre del archivo de almacenamiento de los carritos

  constructor() {
    if (!existsSync(this.cartFile)) {
      this.carts = [];
      this.writeCartFile();
    } else {
      this.carts = this.readCartFile();
    }
  }
  updateCartFile() {
    try {
      writeFileSync(this.cartFile, JSON.stringify(this.carts));
      console.log("Carritos guardados con éxito");
    } catch (error) {
      console.log("Error al guardar los carritos:", error);
    }
  }

  readCartFile() {
    try {
      const data = readFileSync(this.cartFile, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo de carritos:", error);
      return [];
    }
  }

  writeCartFile() {
    writeFileSync(this.cartFile, JSON.stringify(this.carts));
    console.log("Carritos guardados con éxito");
  }

  createCart() {
    const newCart = {
      id: this.carts.length + 1,
      products: [],
    };
    this.carts.push(newCart);
    this.writeCartFile();
    return newCart;
  }

  getCartById(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (cart) {
      const cartWithProducts = {
        id: cart.id,
        products: cart.products.map((productId) => {
          const product = productManager.getProductsById(productId);
          return product ? { ...product } : null;
        }),
      };
      return cartWithProducts;
    }
    return null;
  }

  addToCart(cartId, productId) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      const cart = this.carts[cartIndex];
      cart.products.push(productId);
      this.carts[cartIndex] = cart; // Actualizar el carrito en la lista de carritos
      this.updateCartFile(); // Guardar los cambios en el archivo
      return true;
    }
    return false;
  }

  removeFromCart(cartId, productId) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      const cart = this.carts[cartIndex];
      const index = cart.products.indexOf(productId);
      if (index !== -1) {
        cart.products.splice(index, 1);
        this.carts[cartIndex] = cart; // Actualizar el carrito en la lista de carritos
        this.updateCartFile(); // Guardar los cambios en el archivo
        return true;
      }
    }
    return false;
  }
  
}

export default CartManager;
