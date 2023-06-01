const { writeFileSync, readFileSync } = require("fs");

class ProductManager {
  products;
  static id = 1;
  constructor(title, description, price, thumbnail, code, stock) {
    this.products = [];
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
  writeFileProduct() {
    writeFileSync("productos.json", JSON.stringify(this.products), (err) => {
      if (err) throw err;
      console.log("Agregado con exito");
    });
  }

  readFileProduct() {
    readFileSync("productos.json", "utf-8", (err, data) => {
      if (err) throw err;
      console.log(JSON.parse(data));
    });
  }

  addProduct(product) {
    let productoAagregar = {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,

      id: ProductManager.id,
    };
    let existe = this.products.find((p) => p.code === product.code);
    if (existe) {
      return console.log("El CODIGO  " + product.code + " Ya existe");
    }
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return console.log("Falta llenar un campo");
    } else {
      this.products.push(productoAagregar);
      ProductManager.id++;
    }
  }

  getProducts() {
    const data = JSON.parse(readFileSync(`productos.json`, "utf-8"));
    return data;
  }

  getProductsById(id) {
    const product = JSON.parse(readFileSync(`productos.json`, "utf-8"));
    const productFind = product.find((product) => product.id === id);

    if (productFind) {
      console.log(productFind);
    } else {
      console.log("error");
    }
  }

  deleteProduct(id) {
    let arrayVacio = [];
    this.readFileProduct(); 
    this.products.map((product) => {
      if (product.id !== id) arrayVacio.push(product);
    });

    writeFileSync("productos.json", JSON.stringify(arrayVacio), (err) => {
      if (err) throw err;
    });
    console.log("Producto eliminado");
  }

  updateProduct(id, product) {
    const data = JSON.parse(readFileSync(`productos.json`, "utf-8"));

    data.map((element) => {
      if (element.id === id) {
        (element.title = product.title),
          (element.description = product.description),
          (element.price = product.price),
          (element.thumbnail = product.thumbnail),
          (element.stock = product.stock),
          (element.id = id);
      }
    });
    writeFileSync("productos.json", JSON.stringify(data));
  }
}

const nuevosProductos = new ProductManager();

const product1 = {
  title: "Zapatillas",
  description: "Zapatillas rojas",
  price: 3200,
  thumbnail: "A",
  code: "110",
  stock: 10,
};

const product2 = {
  title: "Guantes",
  description: "Guantes azules",
  price: 4000,
  thumbnail: "AB",
  code: "115",
  stock: 8,
};

const product3 = {
  title: "Pantalones",
  description: "Pantalon de moda",
  price: 5000,
  thumbnail: "ABC",
  code: "120",
  stock: 11,
};

const product4 = {
  title: "Short",
  description: "Short Red",
  price: 6000,
  thumbnail: "ABCD",
  code: "125",
  stock: 13,
};

const product5 = {
  title: "Polo",
  description: "Polo clasico",
  price: 7850,
  thumbnail: "ABCDE",
  code: "130",
  stock: 15,
};

nuevosProductos.addProduct(product1);
nuevosProductos.addProduct(product2);
nuevosProductos.addProduct(product3);
nuevosProductos.addProduct(product4);
nuevosProductos.addProduct(product5);

console.log(nuevosProductos.getProducts());

nuevosProductos.writeFileProduct();
nuevosProductos.readFileProduct();

nuevosProductos.deleteProduct(2);
nuevosProductos.updateProduct((2), {
  title: "'polera'",
  description: "nike",
  price: "2400",
  thumbnail: "nuevo",
  stock: "21",
});
