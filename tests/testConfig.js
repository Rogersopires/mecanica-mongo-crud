import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;

// Setup do banco de dados de teste antes de todos os testes
export const setupTestDB = async () => {
  // Criar servidor MongoDB em memória com configurações específicas
  mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: '127.0.0.1', // Use localhost instead of 0.0.0.0
      port: undefined, // Let it find a free port automatically
    },
    binary: {
      version: '6.0.0', // Use a specific MongoDB version
    },
  });
  const uri = mongoServer.getUri();
  
  // Conectar ao banco de teste
  await mongoose.connect(uri);
};

// Limpeza do banco de dados antes de cada teste
export const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

// Teardown do banco de dados após todos os testes
export const teardownTestDB = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

// Dados de teste reutilizáveis
export const testData = {
  cliente: {
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    endereco: {
      rua: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    }
  },
  
  oficina: {
    nome: "Oficina do Zé",
    endereco: {
      rua: "Av. Principal, 456",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890"
    },
    telefone: "(11) 88888-8888",
    email: "oficina@email.com"
  },
  
  servico: {
    nome: "Troca de óleo",
    descricao: "Troca de óleo do motor",
    preco: 50.00
  },
  
  peca: {
    nome: "Filtro de óleo",
    marca: "Mann",
    quantidade_estoque: 10,
    preco_unitario: 25.00
  }
};

// Helper para criar dados de teste
export const createTestData = async () => {
  // Importar modelos
  const { default: Cliente } = await import("../src/models/Cliente.js");
  const { default: Oficina } = await import("../src/models/Oficina.js");
  const { default: Servico } = await import("../src/models/Servico.js");
  const { default: Peca } = await import("../src/models/Peca.js");
  const { default: Veiculo } = await import("../src/models/Veiculo.js");
  
  // Criar cliente
  const cliente = await Cliente.create(testData.cliente);
  
  // Criar oficina
  const oficina = await Oficina.create(testData.oficina);
  
  // Criar serviço
  const servico = await Servico.create(testData.servico);
  
  // Criar peça
  const peca = await Peca.create(testData.peca);
  
  // Criar veículo
  const veiculo = await Veiculo.create({
    cliente_id: cliente._id,
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    placa: "ABC-1234"
  });
  
  return { cliente, oficina, servico, peca, veiculo };
};