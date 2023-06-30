import { writeFileSync, readFileSync } from "fs";

class ProductManager {
  products;
  static id = 1;

  constructor() {
    this.products = this.readFileProduct();
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      ProductManager.id = lastProduct.id + 1;
    }
  }

  writeFileProduct() {
    writeFileSync("productos.json", JSON.stringify(this.products));
    console.log("Productos guardados con éxito");
  }

  readFileProduct() {
    try {
      const data = readFileSync("productos.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo productos.json", error);
      return [];
    }
  }

  addProduct(product) {
    const existe = this.products.find((p) => p.code === product.code);
    if (existe) {
      console.log("El código " + product.code + " ya existe");
      return;
    }
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Falta llenar un campo");
      return;
    }
    const newProduct = {
      ...product,
      id: ProductManager.id++,
    };
    this.products.push(newProduct);
    this.writeFileProduct();
    console.log("Producto agregado con éxito");
  }
  

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const product = this.products.find((p) => p.id === id);

    if (product) {
      console.log("Producto encontrado");
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    console.log("Producto eliminado");
    this.writeFileProduct();
  }

  updateProduct(id, updatedProduct) {
    this.products = this.products.map(product => {
      if (product.id === id) {
        return {
          ...product,
          ...updatedProduct,
          id: product.id,
        };
      }
      return product;
    });

    console.log("Producto actualizado con éxito");
    this.writeFileProduct();
  }
}

export default ProductManager;
