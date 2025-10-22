import express from "express";
import Veiculo from "../models/Veiculo.js";

const router = express.Router();

// Criar veículo
router.post("/", async (req, res) => {
  try {
    const veiculo = await Veiculo.create(req.body);
    res.status(201).json(veiculo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todos os veículos
router.get("/", async (req, res) => {
  try {
    const veiculos = await Veiculo.find().populate("cliente_id", "nome email");
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar veículo por ID
router.get("/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findById(req.params.id).populate("cliente_id", "nome email");
    if (!veiculo) return res.status(404).json({ message: "Veículo não encontrado" });
    res.json(veiculo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar veículos por cliente
router.get("/cliente/:clienteId", async (req, res) => {
  try {
    const veiculos = await Veiculo.find({ cliente_id: req.params.clienteId }).populate("cliente_id", "nome email");
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar veículo
router.put("/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    }).populate("cliente_id", "nome email");
    if (!veiculo) return res.status(404).json({ message: "Veículo não encontrado" });
    res.json(veiculo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar veículo
router.delete("/:id", async (req, res) => {
  try {
    const veiculo = await Veiculo.findByIdAndDelete(req.params.id);
    if (!veiculo) return res.status(404).json({ message: "Veículo não encontrado" });
    res.json({ message: "Veículo removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;