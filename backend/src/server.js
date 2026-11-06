const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ mensagem: "API Amor de Bicho no ar!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
