import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, testData } from "../testConfig.js";

describe("Serviços Routes", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /servicos", () => {
    it("deve criar um serviço com sucesso", async () => {
      const response = await request(app)
        .post("/servicos")
        .send(testData.servico)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.nome).toBe(testData.servico.nome);
      expect(response.body.preco).toBe(testData.servico.preco);
    });
  });

  describe("GET /servicos", () => {
    it("deve retornar lista de serviços", async () => {
      // Criar serviço primeiro
      await request(app)
        .post("/servicos")
        .send(testData.servico);

      const response = await request(app)
        .get("/servicos")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe(testData.servico.nome);
    });
  });

  describe("GET /servicos/buscar/:nome", () => {
    it("deve buscar serviços por nome (busca parcial)", async () => {
      // Criar alguns serviços
      await request(app)
        .post("/servicos")
        .send(testData.servico);

      await request(app)
        .post("/servicos")
        .send({
          nome: "Troca de filtro",
          descricao: "Troca de filtro de ar",
          preco: 30.00
        });

      const response = await request(app)
        .get("/servicos/buscar/troca")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(s => s.nome.toLowerCase().includes("troca"))).toBe(true);
    });
  });

  describe("GET /servicos/preco/:min/:max", () => {
    it("deve buscar serviços por faixa de preço", async () => {
      // Criar serviços com preços diferentes
      await request(app)
        .post("/servicos")
        .send({ nome: "Serviço Barato", descricao: "Teste", preco: 20.00 });

      await request(app)
        .post("/servicos")
        .send({ nome: "Serviço Médio", descricao: "Teste", preco: 50.00 });

      await request(app)
        .post("/servicos")
        .send({ nome: "Serviço Caro", descricao: "Teste", preco: 100.00 });

      const response = await request(app)
        .get("/servicos/preco/40/80")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe("Serviço Médio");
      expect(response.body[0].preco).toBe(50.00);
    });
  });

  describe("PUT /servicos/:id", () => {
    it("deve atualizar serviço com sucesso", async () => {
      // Criar serviço primeiro
      const createResponse = await request(app)
        .post("/servicos")
        .send(testData.servico);

      const servicoId = createResponse.body._id;
      const dadosAtualizados = {
        ...testData.servico,
        nome: "Troca de óleo premium",
        preco: 75.00
      };

      const response = await request(app)
        .put(`/servicos/${servicoId}`)
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body.nome).toBe(dadosAtualizados.nome);
      expect(response.body.preco).toBe(dadosAtualizados.preco);
    });
  });

  describe("DELETE /servicos/:id", () => {
    it("deve deletar serviço com sucesso", async () => {
      // Criar serviço primeiro
      const createResponse = await request(app)
        .post("/servicos")
        .send(testData.servico);

      const servicoId = createResponse.body._id;

      const response = await request(app)
        .delete(`/servicos/${servicoId}`)
        .expect(200);

      expect(response.body.message).toBe("Serviço removido com sucesso");

      // Verificar se foi deletado
      await request(app)
        .get(`/servicos/${servicoId}`)
        .expect(404);
    });
  });
});