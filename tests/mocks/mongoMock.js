// Mock simples do MongoDB para testes mais rápidos
let collections = {};

export const mockMongoDB = {
  // Simula uma collection do MongoDB
  mockCollection: (name) => ({
    create: async (data) => ({ _id: Math.random().toString(), ...data }),
    find: async (query = {}) => Object.values(collections[name] || {}),
    findById: async (id) => collections[name]?.[id] || null,
    findByIdAndUpdate: async (id, data) => {
      if (!collections[name]?.[id]) return null;
      collections[name][id] = { ...collections[name][id], ...data };
      return collections[name][id];
    },
    findByIdAndDelete: async (id) => {
      const item = collections[name]?.[id];
      if (item) delete collections[name][id];
      return item;
    },
    deleteMany: async () => {
      collections[name] = {};
    }
  }),

  // Limpa todas as collections
  clearAll: () => {
    collections = {};
  },

  // Inicializa uma collection
  initCollection: (name) => {
    collections[name] = {};
  }
};