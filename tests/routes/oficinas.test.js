import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, testData } from "../testConfig.js";

describe("Oficinas Routes", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /oficinas", () => {
    it("deve criar uma oficina com sucesso", async () => {
      const response = await request(app)
        .post("/oficinas")
        .send(testData.oficina)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.nome).toBe(testData.oficina.nome);
      expect(response.body.endereco.cidade).toBe(testData.oficina.endereco.cidade);
    });
  });

  describe("GET /oficinas", () => {
    it("deve retornar lista de oficinas", async () => {
      // Criar oficina primeiro
      await request(app)
        .post("/oficinas")
        .send(testData.oficina);

      const response = await request(app)
        .get("/oficinas")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe(testData.oficina.nome);
    });
  });

  describe("GET /oficinas/cidade/:cidade", () => {
    it("deve buscar oficinas por cidade", async () => {
      // Criar oficina primeiro
      await request(app)
        .post("/oficinas")
        .send(testData.oficina);

      const response = await request(app)
        .get("/oficinas/cidade/são paulo")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].endereco.cidade).toBe("São Paulo");
    });

    it("deve retornar lista vazia para cidade sem oficinas", async () => {
      const response = await request(app)
        .get("/oficinas/cidade/rio de janeiro")
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("GET /oficinas/estado/:estado", () => {
    it("deve buscar oficinas por estado", async () => {
      // Criar oficina primeiro
      await request(app)
        .post("/oficinas")
        .send(testData.oficina);

      const response = await request(app)
        .get("/oficinas/estado/sp")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].endereco.estado).toBe("SP");
    });
  });

  describe("PUT /oficinas/:id", () => {
    it("deve atualizar oficina com sucesso", async () => {
      // Criar oficina primeiro
      const createResponse = await request(app)
        .post("/oficinas")
        .send(testData.oficina);

      const oficinaId = createResponse.body._id;
      const dadosAtualizados = {
        ...testData.oficina,
        nome: "Oficina Super Mecânica",
        telefone: "(11) 55555-5555"
      };

      const response = await request(app)
        .put(`/oficinas/${oficinaId}`)
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body.nome).toBe(dadosAtualizados.nome);
      expect(response.body.telefone).toBe(dadosAtualizados.telefone);
    });
  });

  describe("DELETE /oficinas/:id", () => {
    it("deve deletar oficina com sucesso", async () => {
      // Criar oficina primeiro
      const createResponse = await request(app)
        .post("/oficinas")
        .send(testData.oficina);

      const oficinaId = createResponse.body._id;

      const response = await request(app)
        .delete(`/oficinas/${oficinaId}`)
        .expect(200);

      expect(response.body.message).toBe("Oficina removida com sucesso");

      // Verificar se foi deletada
      await request(app)
        .get(`/oficinas/${oficinaId}`)
        .expect(404);
    });
  });
});