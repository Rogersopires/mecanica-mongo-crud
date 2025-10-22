import mongoose from "mongoose";

const ordemServicoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  veiculo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Veiculo" },
  data_entrada: Date,
  data_saida: Date,
  servicos: [
    {
      servico_id: { type: mongoose.Schema.Types.ObjectId, ref: "Servico" },
      quantidade: Number
    }
  ],
  pecas: [
    {
      peca_id: { type: mongoose.Schema.Types.ObjectId, ref: "Peca" },
      quantidade: Number
    }
  ],
  valor_total: Number,
  status: String
});

export default mongoose.model("OrdemServico", ordemServicoSchema);
