import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, createTestData } from "../testConfig.js";

describe("Veículos Routes", () => {
  let testDataCreated;

  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    testDataCreated = await createTestData();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /veiculos", () => {
    it("deve criar um veículo com sucesso", async () => {
      const veiculoData = {
        cliente_id: testDataCreated.cliente._id,
        marca: "Honda",
        modelo: "Civic",
        ano: 2021,
        placa: "XYZ-5678"
      };

      const response = await request(app)
        .post("/veiculos")
        .send(veiculoData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.marca).toBe(veiculoData.marca);
      expect(response.body.modelo).toBe(veiculoData.modelo);
    });
  });

  describe("GET /veiculos", () => {
    it("deve retornar lista de veículos com dados do cliente", async () => {
      const response = await request(app)
        .get("/veiculos")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("cliente_id");
      expect(response.body[0].cliente_id).toHaveProperty("nome");
      expect(response.body[0].marca).toBe("Toyota");
    });
  });

  describe("GET /veiculos/:id", () => {
    it("deve retornar veículo por ID com dados do cliente", async () => {
      const veiculoId = testDataCreated.veiculo._id;

      const response = await request(app)
        .get(`/veiculos/${veiculoId}`)
        .expect(200);

      expect(response.body._id).toBe(veiculoId.toString());
      expect(response.body).toHaveProperty("cliente_id");
      expect(response.body.cliente_id.nome).toBe(testDataCreated.cliente.nome);
    });

    it("deve retornar 404 para veículo inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      await request(app)
        .get(`/veiculos/${fakeId}`)
        .expect(404);
    });
  });

  describe("GET /veiculos/cliente/:clienteId", () => {
    it("deve retornar veículos de um cliente específico", async () => {
      const clienteId = testDataCreated.cliente._id;

      const response = await request(app)
        .get(`/veiculos/cliente/${clienteId}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].cliente_id._id).toBe(clienteId.toString());
    });

    it("deve retornar lista vazia para cliente sem veículos", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/veiculos/cliente/${fakeId}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("PUT /veiculos/:id", () => {
    it("deve atualizar veículo com sucesso", async () => {
      const veiculoId = testDataCreated.veiculo._id;
      const dadosAtualizados = {
        marca: "Toyota",
        modelo: "Corolla Cross",
        ano: 2023
      };

      const response = await request(app)
        .put(`/veiculos/${veiculoId}`)
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body.modelo).toBe(dadosAtualizados.modelo);
      expect(response.body.ano).toBe(dadosAtualizados.ano);
    });
  });

  describe("DELETE /veiculos/:id", () => {
    it("deve deletar veículo com sucesso", async () => {
      const veiculoId = testDataCreated.veiculo._id;

      const response = await request(app)
        .delete(`/veiculos/${veiculoId}`)
        .expect(200);

      expect(response.body.message).toBe("Veículo removido com sucesso");

      // Verificar se foi deletado
      await request(app)
        .get(`/veiculos/${veiculoId}`)
        .expect(404);
    });
  });
});