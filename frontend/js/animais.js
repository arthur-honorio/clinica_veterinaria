// Página: lista de animais (animais.html) e animais de um tutor (animais.html?tutor=X)

const idTutorFiltrado = obterParametroDaUrl("tutor");

document.addEventListener("DOMContentLoaded", () => {
  exibirAvisoPendente();
  document
    .getElementById("filtroTutor")
    .addEventListener("change", filtrarPorTutor);
  document
    .getElementById("corpoTabelaAnimais")
    .addEventListener("click", tratarCliqueNaTabela);
  carregarPagina();
});

async function carregarPagina() {
  try {
    const tutores = await tutorApi.listar();
    preencherFiltroTutores(tutores);
    atualizarCabecalho(tutores);
    await carregarAnimais(tutores);
  } catch (erro) {
    renderizarAnimais([], new Map());
    mostrarMensagem(erro.message);
  }
}

async function carregarAnimais(tutores) {
  const animais = idTutorFiltrado
    ? await animalApi.listarPorTutor(idTutorFiltrado)
    : await animalApi.listar();
  const nomesDosTutores = new Map(tutores.map((t) => [t.id, t.nome]));
  renderizarAnimais(animais, nomesDosTutores);
}

function preencherFiltroTutores(tutores) {
  const filtro = document.getElementById("filtroTutor");
  tutores.forEach((tutor) => filtro.add(new Option(tutor.nome, tutor.id)));
  filtro.value = idTutorFiltrado ?? "";
}

function atualizarCabecalho(tutores) {
  if (!idTutorFiltrado) return;
  const tutor = tutores.find((t) => String(t.id) === idTutorFiltrado);
  if (tutor) {
    document.getElementById("tituloLista").textContent =
      `Animais de ${tutor.nome}`;
  }
  document.getElementById("linkCadastrarAnimal").href =
    `animalForm.html?tutor=${idTutorFiltrado}`;
}

function filtrarPorTutor(evento) {
  const tutorId = evento.target.value;
  irPara(tutorId ? `animais.html?tutor=${tutorId}` : "animais.html");
}

function renderizarAnimais(animais, nomesDosTutores) {
  const corpo = document.getElementById("corpoTabelaAnimais");
  corpo.innerHTML = animais.length
    ? animais.map((a) => criarLinhaAnimal(a, nomesDosTutores)).join("")
    : `<tr><td colspan="6" class="vazio">Nenhum animal cadastrado.</td></tr>`;
}

function criarLinhaAnimal(animal, nomesDosTutores) {
  const nome = escaparHtml(animal.nome);
  const nomeTutor = nomesDosTutores.get(animal.tutor_id) ?? "—";
  return `
    <tr>
      <td data-rotulo="Nome">${nome}</td>
      <td data-rotulo="Espécie">${escaparHtml(animal.especie)}</td>
      <td data-rotulo="Raça">${escaparHtml(animal.raca)}</td>
      <td data-rotulo="Tutor">${escaparHtml(nomeTutor)}</td>
      <td data-rotulo="Nascimento">${formatarData(animal.nascimento)}</td>
      <td class="acoes">
        <a class="botao botao-secundario" href="animalForm.html?id=${animal.id}">Editar</a>
        <button type="button" class="botao-perigo" data-excluir="${animal.id}" data-nome="${nome}">Excluir</button>
      </td>
    </tr>`;
}

function tratarCliqueNaTabela(evento) {
  const botao = evento.target.closest("[data-excluir]");
  if (botao) excluirAnimal(botao.dataset.excluir, botao.dataset.nome);
}

async function excluirAnimal(id, nome) {
  if (!confirm(`Deseja realmente excluir o animal "${nome}"?`)) return;
  try {
    await animalApi.remover(id);
    mostrarMensagem(`Animal "${nome}" excluído com sucesso.`, "sucesso");
    await carregarAnimais(await tutorApi.listar());
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}
