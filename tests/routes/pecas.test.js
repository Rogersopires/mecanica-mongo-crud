import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, testData } from "../testConfig.js";

describe("Peças Routes", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("POST /pecas", () => {
    it("deve criar uma peça com sucesso", async () => {
      const response = await request(app)
        .post("/pecas")
        .send(testData.peca)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.nome).toBe(testData.peca.nome);
      expect(response.body.quantidade_estoque).toBe(testData.peca.quantidade_estoque);
    });
  });

  describe("GET /pecas", () => {
    it("deve retornar lista de peças", async () => {
      // Criar peça primeiro
      await request(app)
        .post("/pecas")
        .send(testData.peca);

      const response = await request(app)
        .get("/pecas")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe(testData.peca.nome);
    });
  });

  describe("GET /pecas/buscar/:nome", () => {
    it("deve buscar peças por nome (busca parcial)", async () => {
      // Criar peças
      await request(app)
        .post("/pecas")
        .send(testData.peca);

      await request(app)
        .post("/pecas")
        .send({
          nome: "Filtro de ar",
          marca: "Mann",
          quantidade_estoque: 5,
          preco_unitario: 15.00
        });

      const response = await request(app)
        .get("/pecas/buscar/filtro")
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(p => p.nome.toLowerCase().includes("filtro"))).toBe(true);
    });
  });

  describe("GET /pecas/marca/:marca", () => {
    it("deve buscar peças por marca", async () => {
      // Criar peças
      await request(app)
        .post("/pecas")
        .send(testData.peca);

      await request(app)
        .post("/pecas")
        .send({
          nome: "Filtro de combustível",
          marca: "Bosch",
          quantidade_estoque: 8,
          preco_unitario: 35.00
        });

      const response = await request(app)
        .get("/pecas/marca/mann")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].marca).toBe("Mann");
    });
  });

  describe("GET /pecas/estoque/disponivel", () => {
    it("deve retornar apenas peças com estoque > 0", async () => {
      // Criar peças com estoques diferentes
      await request(app)
        .post("/pecas")
        .send({ ...testData.peca, quantidade_estoque: 10 });

      await request(app)
        .post("/pecas")
        .send({ 
          nome: "Peça sem estoque", 
          marca: "Test", 
          quantidade_estoque: 0, 
          preco_unitario: 10.00 
        });

      const response = await request(app)
        .get("/pecas/estoque/disponivel")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].quantidade_estoque).toBeGreaterThan(0);
    });
  });

  describe("GET /pecas/estoque/baixo/:quantidade", () => {
    it("deve retornar peças com estoque baixo", async () => {
      // Criar peças com estoques diferentes
      await request(app)
        .post("/pecas")
        .send({ ...testData.peca, quantidade_estoque: 2 });

      await request(app)
        .post("/pecas")
        .send({ 
          nome: "Peça com muito estoque", 
          marca: "Test", 
          quantidade_estoque: 100, 
          preco_unitario: 10.00 
        });

      const response = await request(app)
        .get("/pecas/estoque/baixo/5")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].quantidade_estoque).toBeLessThanOrEqual(5);
    });
  });

  describe("GET /pecas/preco/:min/:max", () => {
    it("deve buscar peças por faixa de preço", async () => {
      // Criar peças com preços diferentes
      await request(app)
        .post("/pecas")
        .send({ nome: "Peça Barata", marca: "Test", quantidade_estoque: 10, preco_unitario: 15.00 });

      await request(app)
        .post("/pecas")
        .send({ nome: "Peça Cara", marca: "Test", quantidade_estoque: 5, preco_unitario: 50.00 });

      const response = await request(app)
        .get("/pecas/preco/10/30")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe("Peça Barata");
    });
  });

  describe("PATCH /pecas/:id/estoque", () => {
    it("deve atualizar apenas o estoque da peça", async () => {
      // Criar peça primeiro
      const createResponse = await request(app)
        .post("/pecas")
        .send(testData.peca);

      const pecaId = createResponse.body._id;

      const response = await request(app)
        .patch(`/pecas/${pecaId}/estoque`)
        .send({ quantidade_estoque: 50 })
        .expect(200);

      expect(response.body.quantidade_estoque).toBe(50);
      expect(response.body.nome).toBe(testData.peca.nome); // Outros campos inalterados
    });
  });

  describe("PUT /pecas/:id", () => {
    it("deve atualizar peça com sucesso", async () => {
      // Criar peça primeiro
      const createResponse = await request(app)
        .post("/pecas")
        .send(testData.peca);

      const pecaId = createResponse.body._id;
      const dadosAtualizados = {
        ...testData.peca,
        nome: "Filtro de óleo premium",
        preco_unitario: 35.00
      };

      const response = await request(app)
        .put(`/pecas/${pecaId}`)
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body.nome).toBe(dadosAtualizados.nome);
      expect(response.body.preco_unitario).toBe(dadosAtualizados.preco_unitario);
    });
  });

  describe("DELETE /pecas/:id", () => {
    it("deve deletar peça com sucesso", async () => {
      // Criar peça primeiro
      const createResponse = await request(app)
        .post("/pecas")
        .send(testData.peca);

      const pecaId = createResponse.body._id;

      const response = await request(app)
        .delete(`/pecas/${pecaId}`)
        .expect(200);

      expect(response.body.message).toBe("Peça removida com sucesso");

      // Verificar se foi deletada
      await request(app)
        .get(`/pecas/${pecaId}`)
        .expect(404);
    });
  });
});