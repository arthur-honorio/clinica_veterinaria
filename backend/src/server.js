const express = require("express");
const cors = require("cors");
const poll = require("./config/db");
const tutorRoutes = require("./routes/tutorRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/tutores", tutorRoutes);

app.get("/", async (request, response) => {
  const resultado = await poll.query("SELECT NOW() AS agora");
  response.json({
    mensagem: "API Amor de Bicho no ar!",
    horaDoBanco: resultado.rows[0].agora,
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
