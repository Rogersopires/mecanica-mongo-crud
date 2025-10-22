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

export default router;