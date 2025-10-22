import request from "supertest";
import app from "../testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, createTestData } from "../testConfig.js";

describe("Ordens de Serviço Routes", () => {
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

  describe("POST /ordens-servico", () => {
    it("deve criar uma ordem de serviço com sucesso", async () => {
      const ordemData = {
        cliente_id: testDataCreated.cliente._id,
        veiculo_id: testDataCreated.veiculo._id,
        data_entrada: new Date(),
        servicos: [{
          servico_id: testDataCreated.servico._id,
          quantidade: 1
        }],
        pecas: [{
          peca_id: testDataCreated.peca._id,
          quantidade: 2
        }],
        status: "em_andamento"
      };

      const response = await request(app)
        .post("/ordens-servico")
        .send(ordemData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.cliente_id.nome).toBe(testDataCreated.cliente.nome);
      expect(response.body.veiculo_id.marca).toBe(testDataCreated.veiculo.marca);
      expect(response.body.servicos).toHaveLength(1);
      expect(response.body.pecas).toHaveLength(1);
    });
  });

  describe("GET /ordens-servico", () => {
    it("deve retornar lista de ordens de serviço com dados populados", async () => {
      // Criar ordem primeiro
      const ordemData = {
        cliente_id: testDataCreated.cliente._id,
        veiculo_id: testDataCreated.veiculo._id,
        data_entrada: new Date(),
        status: "em_andamento"
      };

      await request(app)
        .post("/ordens-servico")
        .send(ordemData);

      const response = await request(app)
        .get("/ordens-servico")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].cliente_id.nome).toBe(testDataCreated.cliente.nome);
    });
  });

  describe("GET /ordens-servico/cliente/:clienteId", () => {
    it("deve retornar ordens de um cliente específico", async () => {
      // Criar ordem
      const ordemData = {
        cliente_id: testDataCreated.cliente._id,
        veiculo_id: testDataCreated.veiculo._id,
        data_entrada: new Date(),
        status: "em_andamento"
      };

      await request(app)
        .post("/ordens-servico")
        .send(ordemData);

      const response = await request(app)
        .get(`/ordens-servico/cliente/${testDataCreated.cliente._id}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].cliente_id._id).toBe(testDataCreated.cliente._id.toString());
    });
  });

  describe("GET /ordens-servico/status/:status", () => {
    it("deve retornar ordens por status", async () => {
      // Criar ordens com status diferentes
      await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "concluido"
        });

      const response = await request(app)
        .get("/ordens-servico/status/em_andamento")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe("em_andamento");
    });
  });

  describe("GET /ordens-servico/abertas/lista", () => {
    it("deve retornar apenas ordens sem data de saída", async () => {
      // Ordem em aberto
      await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      // Ordem fechada
      await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          data_saida: new Date(),
          status: "concluido"
        });

      const response = await request(app)
        .get("/ordens-servico/abertas/lista")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe("em_andamento");
      expect(response.body[0].data_saida).toBeFalsy();
    });
  });

  describe("PATCH /ordens-servico/:id/status", () => {
    it("deve atualizar status e adicionar data de saída quando concluído", async () => {
      // Criar ordem primeiro
      const createResponse = await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      const ordemId = createResponse.body._id;

      const response = await request(app)
        .patch(`/ordens-servico/${ordemId}/status`)
        .send({ status: "concluido" })
        .expect(200);

      expect(response.body.status).toBe("concluido");
      expect(response.body.data_saida).toBeTruthy();
    });
  });

  describe("POST /ordens-servico/:id/servicos", () => {
    it("deve adicionar serviço à ordem existente", async () => {
      // Criar ordem primeiro
      const createResponse = await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      const ordemId = createResponse.body._id;

      const response = await request(app)
        .post(`/ordens-servico/${ordemId}/servicos`)
        .send({
          servico_id: testDataCreated.servico._id,
          quantidade: 1
        })
        .expect(200);

      expect(response.body.servicos).toHaveLength(1);
      expect(response.body.servicos[0].servico_id.nome).toBe(testDataCreated.servico.nome);
    });
  });

  describe("POST /ordens-servico/:id/pecas", () => {
    it("deve adicionar peça à ordem existente", async () => {
      // Criar ordem primeiro
      const createResponse = await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      const ordemId = createResponse.body._id;

      const response = await request(app)
        .post(`/ordens-servico/${ordemId}/pecas`)
        .send({
          peca_id: testDataCreated.peca._id,
          quantidade: 2
        })
        .expect(200);

      expect(response.body.pecas).toHaveLength(1);
      expect(response.body.pecas[0].peca_id.nome).toBe(testDataCreated.peca.nome);
    });
  });

  describe("GET /ordens-servico/:id/calcular-total", () => {
    it("deve calcular valor total da ordem baseado em serviços e peças", async () => {
      // Criar ordem com serviços e peças
      const createResponse = await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          servicos: [{
            servico_id: testDataCreated.servico._id,
            quantidade: 1
          }],
          pecas: [{
            peca_id: testDataCreated.peca._id,
            quantidade: 2
          }],
          status: "em_andamento"
        });

      const ordemId = createResponse.body._id;

      const response = await request(app)
        .get(`/ordens-servico/${ordemId}/calcular-total`)
        .expect(200);

      // Valor esperado: serviço (50.00 * 1) + peças (25.00 * 2) = 100.00
      const valorEsperado = testDataCreated.servico.preco + (testDataCreated.peca.preco_unitario * 2);
      expect(response.body.valor_total).toBe(valorEsperado);
    });
  });

  describe("GET /ordens-servico/periodo/:dataInicio/:dataFim", () => {
    it("deve buscar ordens por período de data", async () => {
      const hoje = new Date();
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);
      const amanha = new Date();
      amanha.setDate(hoje.getDate() + 1);

      // Criar ordem de hoje
      await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: hoje,
          status: "em_andamento"
        });

      const response = await request(app)
        .get(`/ordens-servico/periodo/${ontem.toISOString().split('T')[0]}/${amanha.toISOString().split('T')[0]}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe("DELETE /ordens-servico/:id", () => {
    it("deve deletar ordem de serviço com sucesso", async () => {
      // Criar ordem primeiro
      const createResponse = await request(app)
        .post("/ordens-servico")
        .send({
          cliente_id: testDataCreated.cliente._id,
          veiculo_id: testDataCreated.veiculo._id,
          data_entrada: new Date(),
          status: "em_andamento"
        });

      const ordemId = createResponse.body._id;

      const response = await request(app)
        .delete(`/ordens-servico/${ordemId}`)
        .expect(200);

      expect(response.body.message).toBe("Ordem de serviço removida com sucesso");

      // Verificar se foi deletada
      await request(app)
        .get(`/ordens-servico/${ordemId}`)
        .expect(404);
    });
  });
});