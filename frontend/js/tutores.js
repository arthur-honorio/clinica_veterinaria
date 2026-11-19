// Página: lista de tutores (tutores.html)

document.addEventListener("DOMContentLoaded", () => {
  exibirAvisoPendente();
  document
    .getElementById("corpoTabelaTutores")
    .addEventListener("click", tratarCliqueNaTabela);
  carregarTutores();
});

async function carregarTutores() {
  try {
    const tutores = await tutorApi.listar();
    renderizarTutores(tutores);
  } catch (erro) {
    renderizarTutores([]);
    mostrarMensagem(erro.message);
  }
}

function renderizarTutores(tutores) {
  const corpo = document.getElementById("corpoTabelaTutores");
  corpo.innerHTML = tutores.length
    ? tutores.map(criarLinhaTutor).join("")
    : `<tr><td colspan="4" class="vazio">Nenhum tutor cadastrado.</td></tr>`;
}

function criarLinhaTutor(tutor) {
  const nome = escaparHtml(tutor.nome);
  return `
    <tr>
      <td data-rotulo="Nome">${nome}</td>
      <td data-rotulo="Telefone">${escaparHtml(formatarTelefone(tutor.telefone))}</td>
      <td data-rotulo="Endereço">${escaparHtml(tutor.endereco)}</td>
      <td class="acoes">
        <a class="botao botao-secundario" href="animais.html?tutor=${tutor.id}">Animais</a>
        <a class="botao botao-secundario" href="tutorForm.html?id=${tutor.id}">Editar</a>
        <button type="button" class="botao-perigo" data-excluir="${tutor.id}" data-nome="${nome}">Excluir</button>
      </td>
    </tr>`;
}

function tratarCliqueNaTabela(evento) {
  const botao = evento.target.closest("[data-excluir]");
  if (botao) excluirTutor(botao.dataset.excluir, botao.dataset.nome);
}

async function excluirTutor(id, nome) {
  if (!confirm(`Deseja realmente excluir o tutor "${nome}"?`)) return;
  try {
    await tutorApi.remover(id);
    mostrarMensagem(`Tutor "${nome}" excluído com sucesso.`, "sucesso");
    carregarTutores();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}
