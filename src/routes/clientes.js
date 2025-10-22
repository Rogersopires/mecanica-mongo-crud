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

export default router;
