import mongoose from "mongoose";
import ProductManager from "../dao/Controller/productoController.js";
import Assert from "assert";
import { expect } from "chai";
import app from "../app.js";
import supertest from "supertest";

mongoose.connect(
  "mongodb+srv://onemid76:1234@ecommerce.gjgde3d.mongodb.net/Ecommerce?retryWrites=true&w=majority"
);

const api = supertest(app);

describe("Cart Route", () => {
  before(function () {
    this.Product = new ProductManager();
  });

  it("Get Products", async function () {
    // Aca estoy haciendo el Test con Mocha
    // Consigo todos los productos
    Assert.ok(this.Product);
    const result = await this.Product.getAllProducts();
    Assert.strictEqual(Array.isArray(result), true);
  });

  it("Create Product", async function () {
    // Aca estoy haciendo el Test con Chai
    // --Creo un producto de prueba
    Assert.ok(this.Product);
    const ProductCreated = {
      name: "ProductoTest1",
      price: 150,
      description: "TestProductDescription",
      category: "CategoryTest",
      stock: 3,
    };
    const ProductoCreado = await this.Product.createProduct(ProductCreated);
    expect(ProductoCreado).to.not.be.null;
  });

  it("[POST] /api/products", async () => {
    // SuperTest Test [POST] 
    const mockProduct = {
      name: "ProducSuperest",
      price: 222,
      description: "DescriptionTest",
      category: "Test",
      stock: 1,
    };
    const response = await api.post("/api/products").send(mockProduct);
    console.log(response.statusCode);
    expect(response.statusCode).to.be.eql(201);
    expect(response.body.payload).to.be.undefined;
  });

  // tengo que preguntar a la profesora porque tengo problemas probando el test
  //  no esta reconociendo mi .env
});
