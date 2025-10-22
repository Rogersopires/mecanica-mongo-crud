import mongoose from "mongoose";

const pecaSchema = new mongoose.Schema({
  nome: String,
  marca: String,
  quantidade_estoque: Number,
  preco_unitario: Number
});

export default mongoose.model("Peca", pecaSchema);
