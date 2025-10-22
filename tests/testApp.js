import express from "express";
import cors from "cors";
import clientesRoutes from "../src/routes/clientes.js";
import veiculosRoutes from "../src/routes/veiculos.js";
import oficinasRoutes from "../src/routes/oficinas.js";
import servicosRoutes from "../src/routes/servicos.js";
import pecasRoutes from "../src/routes/pecas.js";
import ordensServicoRoutes from "../src/routes/ordensServico.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/clientes", clientesRoutes);
app.use("/veiculos", veiculosRoutes);
app.use("/oficinas", oficinasRoutes);
app.use("/servicos", servicosRoutes);
app.use("/pecas", pecasRoutes);
app.use("/ordens-servico", ordensServicoRoutes);

app.get("/", (req, res) => res.json({ 
  status: "API Oficina Mecânica Test OK"
}));

export default app;