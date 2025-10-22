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
  email: String
});

export default mongoose.model("Oficina", oficinaSchema);
