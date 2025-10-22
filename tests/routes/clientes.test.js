import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, testData } from "../testConfig.js";

describe("Clientes Routes", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /clientes", () => {
    it("deve criar um cliente com sucesso", async () => {
      const response = await request(app)
        .post("/clientes")
        .send(testData.cliente)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.nome).toBe(testData.cliente.nome);
      expect(response.body.email).toBe(testData.cliente.email);
    });

    it("deve falhar ao criar cliente sem dados obrigatórios", async () => {
      const response = await request(app)
        .post("/clientes")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /clientes", () => {
    it("deve retornar lista vazia quando não há clientes", async () => {
      const response = await request(app)
        .get("/clientes")
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("deve retornar lista de clientes", async () => {
      // Criar cliente primeiro
      await request(app)
        .post("/clientes")
        .send(testData.cliente);

      const response = await request(app)
        .get("/clientes")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe(testData.cliente.nome);
    });
  });

  describe("GET /clientes/:id", () => {
    it("deve retornar cliente por ID", async () => {
      // Criar cliente primeiro
      const createResponse = await request(app)
        .post("/clientes")
        .send(testData.cliente);

      const clienteId = createResponse.body._id;

      const response = await request(app)
        .get(`/clientes/${clienteId}`)
        .expect(200);

      expect(response.body._id).toBe(clienteId);
      expect(response.body.nome).toBe(testData.cliente.nome);
    });

    it("deve retornar 404 para cliente inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      const response = await request(app)
        .get(`/clientes/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Cliente não encontrado");
    });
  });

  describe("PUT /clientes/:id", () => {
    it("deve atualizar cliente com sucesso", async () => {
      // Criar cliente primeiro
      const createResponse = await request(app)
        .post("/clientes")
        .send(testData.cliente);

      const clienteId = createResponse.body._id;
      const dadosAtualizados = {
        ...testData.cliente,
        nome: "João Silva Updated",
        telefone: "(11) 77777-7777"
      };

      const response = await request(app)
        .put(`/clientes/${clienteId}`)
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body.nome).toBe(dadosAtualizados.nome);
      expect(response.body.telefone).toBe(dadosAtualizados.telefone);
    });

    it("deve retornar 404 ao tentar atualizar cliente inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      const response = await request(app)
        .put(`/clientes/${fakeId}`)
        .send({ nome: "Teste" })
        .expect(404);

      expect(response.body.message).toBe("Cliente não encontrado");
    });
  });

  describe("DELETE /clientes/:id", () => {
    it("deve deletar cliente com sucesso", async () => {
      // Criar cliente primeiro
      const createResponse = await request(app)
        .post("/clientes")
        .send(testData.cliente);

      const clienteId = createResponse.body._id;

      const response = await request(app)
        .delete(`/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.message).toBe("Cliente removido com sucesso");

      // Verificar se realmente foi deletado
      await request(app)
        .get(`/clientes/${clienteId}`)
        .expect(404);
    });

    it("deve retornar 404 ao tentar deletar cliente inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      
      const response = await request(app)
        .delete(`/clientes/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Cliente não encontrado");
    });
  });
});