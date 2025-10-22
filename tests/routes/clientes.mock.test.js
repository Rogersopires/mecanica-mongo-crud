import request from "supertest";
import express from "express";
import clientesRouter from "../../src/routes/clientes.js";
import { mockMongoDB } from "../mocks/mongoMock.js";

// Mock do modelo Cliente
const mockCliente = {
  create: mockMongoDB.mockCollection('clientes').create,
  find: mockMongoDB.mockCollection('clientes').find,
  findById: mockMongoDB.mockCollection('clientes').findById,
  findByIdAndUpdate: mockMongoDB.mockCollection('clientes').findByIdAndUpdate,
  findByIdAndDelete: mockMongoDB.mockCollection('clientes').findByIdAndDelete
};

// Substitui o import do modelo real
jest.mock("../../src/models/Cliente.js", () => ({
  default: mockCliente
}));

const app = express();
app.use(express.json());
app.use("/clientes", clientesRouter);

describe("Clientes Routes (Mock)", () => {
  beforeEach(() => {
    mockMongoDB.clearAll();
    mockMongoDB.initCollection('clientes');
  });

  describe("POST /clientes", () => {
    it("deve criar um cliente com sucesso", async () => {
      const clienteData = {
        nome: "João Silva",
        cpf: "12345678901",
        telefone: "(11) 99999-9999",
        email: "joao@email.com"
      };

      const response = await request(app)
        .post("/clientes")
        .send(clienteData)
        .expect(201);

      expect(response.body).toMatchObject(clienteData);
      expect(response.body).toHaveProperty("_id");
    });
  });

  describe("GET /clientes", () => {
    it("deve retornar lista de clientes", async () => {
      const response = await request(app)
        .get("/clientes")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});