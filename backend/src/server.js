const express = require("express");
const cors = require("cors");
const poll = require("./config/db");
const tutorRoutes = require("./routes/tutorRoutes");
const animalRoutes = require("./routes/animalRoutes");

const ErroDeNegocio = require("./errors/ErroDeNegocio");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tutores", tutorRoutes);
app.use("/animais", animalRoutes);

app.get("/", async (request, response) => {
  const resultado = await poll.query("SELECT NOW() AS agora");
  response.json({
    mensagem: "API Amor de Bicho no ar!",
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

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
