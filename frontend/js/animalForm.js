// Página: cadastro/edição de animal (animalForm.html, ?id=X para editar, ?tutor=X para pré-selecionar o tutor)

const idAnimalEmEdicao = obterParametroDaUrl("id");
const idTutorPreSelecionado = obterParametroDaUrl("tutor");

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formAnimal");
  formulario.elements.nascimento.max = dataDeHoje();
  formulario.addEventListener("submit", salvarAnimal);
  carregarFormulario(formulario);
});

async function carregarFormulario(formulario) {
  try {
    const tutores = await tutorApi.listar();
    preencherSelectTutores(formulario.elements.tutor_id, tutores);
    if (idAnimalEmEdicao) {
      await carregarAnimalParaEdicao(formulario);
    } else if (idTutorPreSelecionado) {
      formulario.elements.tutor_id.value = idTutorPreSelecionado;
    }
    atualizarLinkCancelar(formulario.elements.tutor_id.value);
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

function preencherSelectTutores(select, tutores) {
  tutores.forEach((tutor) => select.add(new Option(tutor.nome, tutor.id)));
  if (!tutores.length) {
    mostrarMensagem(
      "Nenhum tutor cadastrado. Cadastre um tutor antes de cadastrar animais.",
      "aviso",
    );
  }
}

async function carregarAnimalParaEdicao(formulario) {
  document.getElementById("tituloFormulario").textContent = "Editar Animal";
  const animal = await animalApi.buscar(idAnimalEmEdicao);
  preencherFormulario(formulario, {
    ...animal,
    nascimento: paraCampoData(animal.nascimento),
  });
}

function atualizarLinkCancelar(tutorId) {
  document.getElementById("linkCancelar").href = paginaDeAnimais(tutorId);
}

function paginaDeAnimais(tutorId) {
  return tutorId ? `animais.html?tutor=${tutorId}` : "animais.html";
}

async function salvarAnimal(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const animal = lerFormulario(formulario);

  esconderMensagem();
  const erros = validarAnimal(animal);
  mostrarErrosDosCampos(formulario, erros);
  if (Object.keys(erros).length) return;

  const botao = formulario.querySelector("button[type=submit]");
  definirCarregando(botao, true);
  try {
    await enviarAnimal({ ...animal, tutor_id: Number(animal.tutor_id) });
    avisarNaProximaPagina(
      idAnimalEmEdicao
        ? "Animal atualizado com sucesso!"
        : "Animal cadastrado com sucesso!",
    );
    irPara(paginaDeAnimais(animal.tutor_id));
  } catch (erro) {
    mostrarMensagem(erro.message);
    definirCarregando(botao, false);
  }
}

function enviarAnimal(animal) {
  return idAnimalEmEdicao
    ? animalApi.editar(idAnimalEmEdicao, animal)
    : animalApi.inserir(animal);
}
