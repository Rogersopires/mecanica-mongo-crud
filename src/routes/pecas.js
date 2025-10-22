import express from "express";
import Peca from "../models/Peca.js";

const router = express.Router();

// Criar peça
router.post("/", async (req, res) => {
  try {
    const peca = await Peca.create(req.body);
    res.status(201).json(peca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todas as peças
router.get("/", async (req, res) => {
  try {
    const pecas = await Peca.find();
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peça por ID
router.get("/:id", async (req, res) => {
  try {
    const peca = await Peca.findById(req.params.id);
    if (!peca) return res.status(404).json({ message: "Peça não encontrada" });
    res.json(peca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peças por nome (busca parcial)
router.get("/buscar/:nome", async (req, res) => {
  try {
    const pecas = await Peca.find({ nome: new RegExp(req.params.nome, "i") });
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peças por marca
router.get("/marca/:marca", async (req, res) => {
  try {
    const pecas = await Peca.find({ marca: new RegExp(req.params.marca, "i") });
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peças em estoque (quantidade > 0)
router.get("/estoque/disponivel", async (req, res) => {
  try {
    const pecas = await Peca.find({ quantidade_estoque: { $gt: 0 } });
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peças com estoque baixo (quantidade <= valor especificado)
router.get("/estoque/baixo/:quantidade", async (req, res) => {
  try {
    const quantidade = parseInt(req.params.quantidade);
    const pecas = await Peca.find({ quantidade_estoque: { $lte: quantidade } });
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar peças por faixa de preço
router.get("/preco/:min/:max", async (req, res) => {
  try {
    const { min, max } = req.params;
    const pecas = await Peca.find({ 
      preco_unitario: { 
        $gte: parseFloat(min), 
        $lte: parseFloat(max) 
      } 
    });
    res.json(pecas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar peça
router.put("/:id", async (req, res) => {
  try {
    const peca = await Peca.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!peca) return res.status(404).json({ message: "Peça não encontrada" });
    res.json(peca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar estoque da peça
router.patch("/:id/estoque", async (req, res) => {
  try {
    const { quantidade_estoque } = req.body;
    const peca = await Peca.findByIdAndUpdate(
      req.params.id, 
      { quantidade_estoque }, 
      { new: true, runValidators: true }
    );
    if (!peca) return res.status(404).json({ message: "Peça não encontrada" });
    res.json(peca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar peça
router.delete("/:id", async (req, res) => {
  try {
    const peca = await Peca.findByIdAndDelete(req.params.id);
    if (!peca) return res.status(404).json({ message: "Peça não encontrada" });
    res.json({ message: "Peça removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;