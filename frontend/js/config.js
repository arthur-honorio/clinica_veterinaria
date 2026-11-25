// Endereço da API (backend).
// Rodando localmente, usa http://localhost:3000.
// Fora do localhost (aplicação publicada), usa a API publicada na Vercel.
const URL_API_LOCAL = "http://localhost:3000";
const URL_API_PUBLICADA = "https://clinica-patas-e-cia-api.vercel.app";

const RODANDO_LOCALMENTE = ["localhost", "127.0.0.1", ""].includes(
  window.location.hostname,
);

const API_URL = RODANDO_LOCALMENTE ? URL_API_LOCAL : URL_API_PUBLICADA;
