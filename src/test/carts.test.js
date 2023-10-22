import mongoose from "mongoose";
import CartManager from "../dao/Controller/cartController.js";
import Assert from "assert";
import { expect } from "chai";
import app from "../../app.js";
import supertest from "supertest";

mongoose.connect(
  "mongodb+srv://onemid76:1234@ecommerce.gjgde3d.mongodb.net/Ecommerce?retryWrites=true&w=majority"
);

const api = supertest(app)

describe("Cart Route", () => {
  before(function () {
    this.Cartproduct = new CartManager();
  });

  it("Get Carts", async function () {

    // Aca estoy haciendo el Test con Mocha 
    Assert.ok(this.Cartproduct);

    const result = await this.Cartproduct.getCarts();

    // console.log(result);
    Assert.strictEqual(Array.isArray(result), true);
  }).timeout(5000);

  it("Create Cart", async function () {
    // Aca estoy haciendo el Test con Chai
    Assert.ok(this.Cartproduct);

    const CarritoTest = {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      products: [],
    };

    const createCart = await this.Cartproduct.createCart(CarritoTest);

    expect(createCart).to.not.be.null;
  });

  it("testing SuperTest",async ()=>{
    await api
    .get('/api/carts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  // tengo que preguntar a la profesora porque tengo problemas probando el test 
  //  no esta reconociendo mi .env 
});
