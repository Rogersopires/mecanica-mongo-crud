import express from "express";
import Oficina from "../models/Oficina.js";

const router = express.Router();

// Criar oficina
router.post("/", async (req, res) => {
  try {
    const oficina = await Oficina.create(req.body);
    res.status(201).json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todas as oficinas
router.get("/", async (req, res) => {
  try {
    const oficinas = await Oficina.find();
    res.json(oficinas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar oficinas por cidade
router.get("/cidade/:cidade", async (req, res) => {
  try {
    const cidade = decodeURIComponent(req.params.cidade);
    const oficinas = await Oficina.find({ "endereco.cidade": new RegExp(cidade, "i") });
    res.json(oficinas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar oficinas por estado
router.get("/estado/:estado", async (req, res) => {
  try {
    const estado = decodeURIComponent(req.params.estado);
    const oficinas = await Oficina.find({ "endereco.estado": new RegExp(estado, "i") });
    res.json(oficinas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar oficina por ID
router.get("/:id", async (req, res) => {
  try {
    const oficina = await Oficina.findById(req.params.id);
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar oficina
router.put("/:id", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar oficina
router.delete("/:id", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndDelete(req.params.id);
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json({ message: "Oficina removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vincular cliente à oficina
router.post("/:id/clientes/:clienteId", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { clientes: req.params.clienteId } },
      { new: true }
    ).populate('clientes');
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar oficina completa com clientes, veículos e ordens de serviço
router.get("/:id/completo", async (req, res) => {
  try {
    const oficina = await Oficina.findById(req.params.id)
      .populate({
        path: 'clientes',
        populate: {
          path: 'veiculos',
          model: 'Veiculo'
        }
      })
      .populate({
        path: 'ordensServico',
        populate: [
          {
            path: 'cliente_id',
            select: 'nome email telefone cpf'
          },
          {
            path: 'veiculo_id',
            select: 'marca modelo ano placa'
          },
          {
            path: 'servicos.servico_id',
            select: 'nome descricao preco'
          },
          {
            path: 'pecas.peca_id',
            select: 'nome marca preco_unitario quantidade_estoque'
          }
        ]
      });
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover cliente da oficina
router.delete("/:id/clientes/:clienteId", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(
      req.params.id,
      { $pull: { clientes: req.params.clienteId } },
      { new: true }
    ).populate('clientes');
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vincular ordem de serviço à oficina
router.post("/:id/ordens/:ordemId", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { ordensServico: req.params.ordemId } },
      { new: true }
    ).populate('ordensServico');
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar ordens de serviço completas de uma oficina
router.get("/:id/ordens", async (req, res) => {
  try {
    const oficina = await Oficina.findById(req.params.id)
      .populate({
        path: 'ordensServico',
        populate: [
          { 
            path: 'cliente_id', 
            select: 'nome email telefone cpf',
            populate: {
              path: 'veiculos',
              select: 'marca modelo ano placa'
            }
          },
          { path: 'veiculo_id', select: 'marca modelo ano placa' },
          { path: 'servicos.servico_id', select: 'nome descricao preco' },
          { path: 'pecas.peca_id', select: 'nome marca preco_unitario quantidade_estoque' }
        ]
      });
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina.ordensServico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover ordem de serviço da oficina
router.delete("/:id/ordens/:ordemId", async (req, res) => {
  try {
    const oficina = await Oficina.findByIdAndUpdate(
      req.params.id,
      { $pull: { ordensServico: req.params.ordemId } },
      { new: true }
    ).populate('ordensServico');
    if (!oficina) return res.status(404).json({ message: "Oficina não encontrada" });
    res.json(oficina);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;