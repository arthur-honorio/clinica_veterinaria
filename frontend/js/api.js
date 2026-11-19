// Camada de serviço: única parte do frontend que conversa com o backend.

const MENSAGEM_SEM_CONEXAO =
  "Não foi possível conectar ao servidor. Verifique se a API está no ar.";

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { "Content-Type": "application/json" },
      ...opcoes,
    });
  } catch {
    throw new Error(MENSAGEM_SEM_CONEXAO);
  }

  if (resposta.status === 204) return null;

  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(corpo?.mensagem || `Erro ${resposta.status} no servidor.`);
  }
  return corpo;
}

function criarServicoCrud(caminhoBase) {
  return {
    listar: () => requisitar(caminhoBase),
    buscar: (id) => requisitar(`${caminhoBase}/${id}`),
    inserir: (dados) =>
      requisitar(caminhoBase, { method: "POST", body: JSON.stringify(dados) }),
    editar: (id, dados) =>
      requisitar(`${caminhoBase}/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      }),
    remover: (id) => requisitar(`${caminhoBase}/${id}`, { method: "DELETE" }),
  };
}

const tutorApi = criarServicoCrud("/tutores");

const animalApi = {
  ...criarServicoCrud("/animais"),
  listarPorTutor: (tutorId) => requisitar(`/animais/tutor/${tutorId}`),
};
