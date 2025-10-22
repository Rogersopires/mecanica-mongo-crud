import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import clientesRoutes from "./routes/clientes.js";
import veiculosRoutes from "./routes/veiculos.js";
import oficinasRoutes from "./routes/oficinas.js";
import servicosRoutes from "./routes/servicos.js";
import pecasRoutes from "./routes/pecas.js";
import ordensServicoRoutes from "./routes/ordensServico.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Rotas da API
app.use("/clientes", clientesRoutes);
app.use("/veiculos", veiculosRoutes);
app.use("/oficinas", oficinasRoutes);
app.use("/servicos", servicosRoutes);
app.use("/pecas", pecasRoutes);
app.use("/ordens-servico", ordensServicoRoutes);

app.get("/", (req, res) => res.json({ 
  status: "API Oficina Mecânica OK",
  endpoints: {
    clientes: "/clientes",
    veiculos: "/veiculos",
    oficinas: "/oficinas",
    servicos: "/servicos",
    pecas: "/pecas",
    ordensServico: "/ordens-servico"
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚗 Servidor rodando na porta ${PORT}`));
