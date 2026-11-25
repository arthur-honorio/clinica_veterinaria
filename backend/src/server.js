const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const tutorRoutes = require("./routes/tutorRoutes");
const animalRoutes = require("./routes/animalRoutes");

const ErroDeNegocio = require("./errors/ErroDeNegocio");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tutores", tutorRoutes);
app.use("/animais", animalRoutes);

app.get("/", async (request, response) => {
  const resultado = await pool.query("SELECT NOW() AS agora");
  response.json({
    mensagem: "API Clínica Patas & Cia no ar!",
    horaDoBanco: resultado.rows[0].agora,
  });
});

app.use((erro, request, response, next) => {
  if (erro instanceof ErroDeNegocio) {
    const { status, message } = erro;
    return response.status(status).json({ mensagem: message });
  }
  console.log(erro);
  response.status(500).json({ mensagem: "Erro interno no servidor" });
});

// Na Vercel o app roda como função serverless: ela importa o app e cuida das requisições.
if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
}

module.exports = app;
