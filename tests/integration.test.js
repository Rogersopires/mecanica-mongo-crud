import request from "supertest";
import app from "./testApp.js";
import { setupTestDB, clearDatabase, teardownTestDB, createTestData } from "./testConfig.js";

describe("API Integration Tests", () => {
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

  describe("Workflow completo de oficina mecânica", () => {
    it("deve executar um fluxo completo: cliente -> veículo -> ordem de serviço -> cálculo total", async () => {
      // 1. Verificar se cliente foi criado
      const clientesResponse = await request(app)
        .get("/clientes")
        .expect(200);
      
      expect(clientesResponse.body).toHaveLength(1);
      const clienteId = clientesResponse.body[0]._id;

      // 2. Criar um novo veículo para este cliente
      const veiculoData = {
        cliente_id: clienteId,
        marca: "Honda",
        modelo: "Civic",
        ano: 2021,
        placa: "XYZ-9876"
      };

      const veiculoResponse = await request(app)
        .post("/veiculos")
        .send(veiculoData)
        .expect(201);

      const veiculoId = veiculoResponse.body._id;

      // 3. Criar uma ordem de serviço
      const ordemData = {
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        data_entrada: new Date(),
        status: "em_andamento"
      };

      const ordemResponse = await request(app)
        .post("/ordens-servico")
        .send(ordemData)
        .expect(201);

      const ordemId = ordemResponse.body._id;

      // 4. Adicionar serviços à ordem
      await request(app)
        .post(`/ordens-servico/${ordemId}/servicos`)
        .send({
          servico_id: testDataCreated.servico._id,
          quantidade: 1
        })
        .expect(200);

      // 5. Adicionar peças à ordem
      await request(app)
        .post(`/ordens-servico/${ordemId}/pecas`)
        .send({
          peca_id: testDataCreated.peca._id,
          quantidade: 3
        })
        .expect(200);

      // 6. Calcular total da ordem
      const totalResponse = await request(app)
        .get(`/ordens-servico/${ordemId}/calcular-total`)
        .expect(200);

      // Valor esperado: serviço (50.00 * 1) + peças (25.00 * 3) = 125.00
      expect(totalResponse.body.valor_total).toBe(125.00);

      // 7. Finalizar a ordem
      const finalizarResponse = await request(app)
        .patch(`/ordens-servico/${ordemId}/status`)
        .send({ status: "concluido" })
        .expect(200);

      expect(finalizarResponse.body.status).toBe("concluido");
      expect(finalizarResponse.body.data_saida).toBeTruthy();

      // 8. Verificar se ordem não aparece mais nas ordens abertas
      const abertasResponse = await request(app)
        .get("/ordens-servico/abertas/lista")
        .expect(200);

      expect(abertasResponse.body).toHaveLength(0);
    });

    it("deve gerenciar estoque de peças corretamente", async () => {
      // 1. Verificar estoque inicial
      const pecaResponse = await request(app)
        .get(`/pecas/${testDataCreated.peca._id}`)
        .expect(200);

      expect(pecaResponse.body.quantidade_estoque).toBe(10);

      // 2. Atualizar estoque (simular uso em ordem de serviço)
      const novoEstoque = pecaResponse.body.quantidade_estoque - 5;
      
      const atualizarResponse = await request(app)
        .patch(`/pecas/${testDataCreated.peca._id}/estoque`)
        .send({ quantidade_estoque: novoEstoque })
        .expect(200);

      expect(atualizarResponse.body.quantidade_estoque).toBe(5);

      // 3. Verificar peças com estoque baixo
      const estoqueBaixoResponse = await request(app)
        .get("/pecas/estoque/baixo/7")
        .expect(200);

      expect(estoqueBaixoResponse.body).toHaveLength(1);
      expect(estoqueBaixoResponse.body[0]._id).toBe(testDataCreated.peca._id.toString());
    });

    it("deve buscar corretamente por diferentes filtros", async () => {
      // 1. Buscar veículos por cliente
      const veiculosClienteResponse = await request(app)
        .get(`/veiculos/cliente/${testDataCreated.cliente._id}`)
        .expect(200);

      expect(veiculosClienteResponse.body).toHaveLength(1);

      // 2. Buscar serviços por nome
      const servicosResponse = await request(app)
        .get("/servicos/buscar/óleo")
        .expect(200);

      expect(servicosResponse.body).toHaveLength(1);

      // 3. Buscar peças por marca
      const pecasMarcaResponse = await request(app)
        .get("/pecas/marca/mann")
        .expect(200);

      expect(pecasMarcaResponse.body).toHaveLength(1);

      // 4. Buscar oficinas por cidade
      const oficinasResponse = await request(app)
        .get("/oficinas/cidade/são paulo")
        .expect(200);

      expect(oficinasResponse.body).toHaveLength(1);
    });
  });

  describe("Validações de erro", () => {
    it("deve retornar 404 para recursos inexistentes", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      await request(app).get(`/clientes/${fakeId}`).expect(404);
      await request(app).get(`/veiculos/${fakeId}`).expect(404);
      await request(app).get(`/oficinas/${fakeId}`).expect(404);
      await request(app).get(`/servicos/${fakeId}`).expect(404);
      await request(app).get(`/pecas/${fakeId}`).expect(404);
      await request(app).get(`/ordens-servico/${fakeId}`).expect(404);
    });

    it("deve validar dados obrigatórios", async () => {
      // Tentar criar registros sem dados obrigatórios
      await request(app).post("/clientes").send({}).expect(400);
      await request(app).post("/veiculos").send({}).expect(400);
      await request(app).post("/oficinas").send({}).expect(400);
      await request(app).post("/servicos").send({}).expect(400);
      await request(app).post("/pecas").send({}).expect(400);
    });
  });

  describe("Endpoint raiz", () => {
    it("deve retornar informações da API", async () => {
      const response = await request(app)
        .get("/")
        .expect(200);

      expect(response.body.status).toBe("API Oficina Mecânica Test OK");
    });
  });
});