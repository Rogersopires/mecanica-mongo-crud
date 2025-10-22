import express from "express";
import Servico from "../models/Servico.js";

const router = express.Router();

// Criar serviço
router.post("/", async (req, res) => {
  try {
    const servico = await Servico.create(req.body);
    res.status(201).json(servico);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todos os serviços
router.get("/", async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar serviços por nome (busca parcial)
router.get("/buscar/:nome", async (req, res) => {
  try {
    const nome = decodeURIComponent(req.params.nome);
    const servicos = await Servico.find({ nome: new RegExp(nome, "i") });
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar serviços por faixa de preço
router.get("/preco/:min/:max", async (req, res) => {
  try {
    const { min, max } = req.params;
    const servicos = await Servico.find({
      preco: { $gte: parseFloat(min), $lte: parseFloat(max) }
    });
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar serviço por ID
router.get("/:id", async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });
    res.json(servico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar serviço
router.put("/:id", async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });
    res.json(servico);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar serviço
router.delete("/:id", async (req, res) => {
  try {
    const servico = await Servico.findByIdAndDelete(req.params.id);
    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });
    res.json({ message: "Serviço removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;