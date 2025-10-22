import mongoose from "mongoose";

const oficinaSchema = new mongoose.Schema({
  nome: String,
  endereco: {
    rua: String,
    cidade: String,
    estado: String,
    cep: String
  },
  telefone: String,
  email: String,
  clientes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente"
  }],
  ordensServico: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrdemServico"
  }]
});

export default mongoose.model("Oficina", oficinaSchema);
