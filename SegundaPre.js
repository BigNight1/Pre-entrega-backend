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
    const data = readFileSync('productos.json', 'utf-8');
    this.products = JSON.parse(data);
    console.log(this.products);
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
    console.log(arrayVacio);

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
// nuevosProductos.readFileProduct();
//

//-------------------- PASOS A SEGUIR--------------------------

// 1- DESCOMENTO LAS SIGUIENTES LÍNEAS:
nuevosProductos.addProduct(product1);
nuevosProductos.addProduct(product2);
nuevosProductos.writeFileProduct();

//2- COMENTO LO ANTERIOR Y DESCOMENTO LO SIGUIENTE DE A UNO Y VAS PROBANDO:
// nuevosProductos.updateProduct((2), {
//     title: "'polera'",
//     description: "nike",
//     price: "2400",
//     thumbnail: "nuevo",
//     stock: "21",
//   });
  // nuevosProductos.deleteProduct(2);