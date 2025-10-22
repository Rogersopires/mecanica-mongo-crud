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
  },
  veiculos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Veiculo"
  }],
  oficinas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Oficina"
  }]
});

export default mongoose.model("Cliente", clienteSchema);
