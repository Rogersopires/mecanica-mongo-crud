import mongoose from "mongoose";

const ordemServicoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
  veiculo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Veiculo", required: true },
  oficina_id: { type: mongoose.Schema.Types.ObjectId, ref: "Oficina", required: true },
  data_entrada: { type: Date, default: Date.now },
  data_saida: Date,
  servicos: [
    {
      servico_id: { type: mongoose.Schema.Types.ObjectId, ref: "Servico" },
      quantidade: { type: Number, default: 1 },
      preco_servico: Number
    }
  ],
  pecas: [
    {
      peca_id: { type: mongoose.Schema.Types.ObjectId, ref: "Peca" },
      quantidade: { type: Number, default: 1 },
      preco_unitario: Number
    }
  ],
  valor_total: { type: Number, default: 0 },
  status: { type: String, enum: ['aberta', 'em_andamento', 'finalizada', 'cancelada'], default: 'aberta' }
});

export default mongoose.model("OrdemServico", ordemServicoSchema);
