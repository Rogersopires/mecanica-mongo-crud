import express from "express";
import OrdemServico from "../models/OrdemServico.js";

const router = express.Router();

// Criar ordem de serviço
router.post("/", async (req, res) => {
  try {
    const ordemServico = await OrdemServico.create(req.body);
    const ordemPopulada = await OrdemServico.findById(ordemServico._id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    res.status(201).json(ordemPopulada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todas as ordens de serviço
router.get("/", async (req, res) => {
  try {
    const ordens = await OrdemServico.find()
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordem de serviço por ID
router.get("/:id", async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    res.json(ordem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordens por cliente
router.get("/cliente/:clienteId", async (req, res) => {
  try {
    const ordens = await OrdemServico.find({ cliente_id: req.params.clienteId })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordens por veículo
router.get("/veiculo/:veiculoId", async (req, res) => {
  try {
    const ordens = await OrdemServico.find({ veiculo_id: req.params.veiculoId })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordens por status
router.get("/status/:status", async (req, res) => {
  try {
    const ordens = await OrdemServico.find({ status: req.params.status })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordens por período
router.get("/periodo/:dataInicio/:dataFim", async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.params;
    const ordens = await OrdemServico.find({
      data_entrada: {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      }
    })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ordens em aberto (sem data de saída)
router.get("/abertas/lista", async (req, res) => {
  try {
    const ordens = await OrdemServico.find({ 
      $or: [
        { data_saida: null },
        { data_saida: { $exists: false } }
      ]
    })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar ordem de serviço
router.put("/:id", async (req, res) => {
  try {
    const ordem = await OrdemServico.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    res.json(ordem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar status da ordem
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };
    
    // Se o status for "concluído", adicionar data de saída
    if (status === "concluido" || status === "finalizado") {
      updateData.data_saida = new Date();
    }
    
    const ordem = await OrdemServico.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    )
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    res.json(ordem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Adicionar serviço à ordem
router.post("/:id/servicos", async (req, res) => {
  try {
    const { servico_id, quantidade } = req.body;
    const ordem = await OrdemServico.findById(req.params.id);
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    
    ordem.servicos.push({ servico_id, quantidade });
    await ordem.save();
    
    const ordemAtualizada = await OrdemServico.findById(ordem._id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    res.json(ordemAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Adicionar peça à ordem
router.post("/:id/pecas", async (req, res) => {
  try {
    const { peca_id, quantidade } = req.body;
    const ordem = await OrdemServico.findById(req.params.id);
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    
    ordem.pecas.push({ peca_id, quantidade });
    await ordem.save();
    
    const ordemAtualizada = await OrdemServico.findById(ordem._id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    res.json(ordemAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Calcular valor total da ordem
router.get("/:id/calcular-total", async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id)
      .populate("servicos.servico_id", "preco")
      .populate("pecas.peca_id", "preco_unitario");
    
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    
    let valorTotal = 0;
    
    // Somar serviços
    ordem.servicos.forEach(item => {
      valorTotal += item.servico_id.preco * item.quantidade;
    });
    
    // Somar peças
    ordem.pecas.forEach(item => {
      valorTotal += item.peca_id.preco_unitario * item.quantidade;
    });
    
    // Atualizar o valor total na ordem
    ordem.valor_total = valorTotal;
    await ordem.save();
    
    res.json({ valor_total: valorTotal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar ordens por oficina
router.get("/oficina/:oficinaId", async (req, res) => {
  try {
    const ordens = await OrdemServico.find({ oficina_id: req.params.oficinaId })
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario")
      .sort({ data_entrada: -1 });
    
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover serviço da ordem
router.delete("/:id/servicos/:servicoIndex", async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id);
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    
    ordem.servicos.splice(req.params.servicoIndex, 1);
    await ordem.save();
    
    const ordemAtualizada = await OrdemServico.findById(ordem._id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    res.json(ordemAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remover peça da ordem
router.delete("/:id/pecas/:pecaIndex", async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id);
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    
    ordem.pecas.splice(req.params.pecaIndex, 1);
    await ordem.save();
    
    const ordemAtualizada = await OrdemServico.findById(ordem._id)
      .populate("cliente_id", "nome email telefone")
      .populate("veiculo_id", "marca modelo ano placa")
      .populate("oficina_id", "nome telefone email")
      .populate("servicos.servico_id", "nome descricao preco")
      .populate("pecas.peca_id", "nome marca preco_unitario");
    
    res.json(ordemAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar ordem de serviço
router.delete("/:id", async (req, res) => {
  try {
    const ordem = await OrdemServico.findByIdAndDelete(req.params.id);
    if (!ordem) return res.status(404).json({ message: "Ordem de serviço não encontrada" });
    res.json({ message: "Ordem de serviço removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;