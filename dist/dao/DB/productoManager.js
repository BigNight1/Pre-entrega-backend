import { productModel } from "../models/productSchema.js";
class ProductManager {
  async createProduct(productData) {
    try {
      const newProduct = await productModel.create(productData);
      return newProduct;
    } catch (error) {
      console.log("Error al crear el producto:", error);
      return null;
    }
  }
  async getProductById(productId) {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (error) {
      "Error al obtener el producto:", error;
      return null;
    }
  }
  async getAllProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      console.log("Error al obtener todos los productos:", error);
      return null;
    }
  }
  async updateProduct(productId, updatedData) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedData, {
        new: true
      });
      return updatedProduct;
    } catch (error) {
      console.log("Error al actualizar el producto:", error);
      return null;
    }
  }
  async deleteProduct(productName) {
    try {
      const product = await productModel.findOneAndDelete({
        name: productName
      });
      return product;
    } catch (error) {
      console.log("Error al eliminar el producto:", error);
      return null;
    }
  }
}
export default ProductManager;