import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório']
  }
});

export default mongoose.model("Cliente", clienteSchema);
