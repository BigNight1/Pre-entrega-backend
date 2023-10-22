// Dependencias
import { expect } from "chai";
import supertest from "supertest";

// Importaciones Locales
import app from "../app.js";

const api = supertest(app);

describe("Session Route", () => {
  it("[POST] Login Test", async () => {
    // Probando el Login
    const UserLogin = {
      email: "edu_armas11@hotmail.com",
      password: "123456",
    };
    const response = await api.post("/api/session/login").send(UserLogin);
    expect(response.statusCode).to.be.eql(200);
  });

  it("[POST] Register Test", async () => {
    const CreatedUserTest = {
      first_name: "UserTest",
      last_name: "UserTest",
      email: "UserTest@test.tt",
      age: "17",
      password: "123456",
    };
    const response = await api
      .post("/api/session/register")
      .send(CreatedUserTest);
    console.log(response.body);
    expect(response.statusCode).to.be.eql(200);
  }).timeout(5000);

});
