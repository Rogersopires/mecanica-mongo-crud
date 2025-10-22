import mongoose from "mongoose";

const veiculoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  marca: String,
  modelo: String,
  ano: Number,
  placa: String
});

export default mongoose.model("Veiculo", veiculoSchema);
