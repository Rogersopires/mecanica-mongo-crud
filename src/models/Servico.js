import mongoose from "mongoose";

const servicoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  preco: Number
});

export default mongoose.model("Servico", servicoSchema);
