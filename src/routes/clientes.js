import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

// Criar cliente
router.post("/", async (req, res) => {
  const cliente = await Cliente.create(req.body);
  res.status(201).json(cliente);
});

// Listar todos
router.get("/", async (req, res) => {
  const clientes = await Cliente.find();
  res.json(clientes);
});

// Buscar por ID
router.get("/:id", async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
  res.json(cliente);
});

// Atualizar
router.put("/:id", async (req, res) => {
  const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
  res.json(cliente);
});

// Deletar
router.delete("/:id", async (req, res) => {
  const cliente = await Cliente.findByIdAndDelete(req.params.id);
  if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
  res.json({ message: "Cliente removido com sucesso" });
});

// Vincular veículo ao cliente
router.post("/:id/veiculos/:veiculoId", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { veiculos: req.params.veiculoId } },
      { new: true }
    ).populate('veiculos');
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vincular oficina ao cliente
router.post("/:id/oficinas/:oficinaId", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { oficinas: req.params.oficinaId } },
      { new: true }
    ).populate('oficinas');
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar cliente com veículos e oficinas
router.get("/:id/completo", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
      .populate('veiculos')
      .populate('oficinas');
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover veículo do cliente
router.delete("/:id/veiculos/:veiculoId", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $pull: { veiculos: req.params.veiculoId } },
      { new: true }
    ).populate('veiculos');
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remover oficina do cliente
router.delete("/:id/oficinas/:oficinaId", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $pull: { oficinas: req.params.oficinaId } },
      { new: true }
    ).populate('oficinas');
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
