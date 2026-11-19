// Página: cadastro/edição de tutor (tutorForm.html e tutorForm.html?id=X)

const idTutorEmEdicao = obterParametroDaUrl("id");

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formTutor");
  aplicarMascaraTelefone(formulario.elements.telefone);
  formulario.addEventListener("submit", salvarTutor);
  if (idTutorEmEdicao) carregarTutorParaEdicao(formulario);
});

async function carregarTutorParaEdicao(formulario) {
  document.getElementById("tituloFormulario").textContent = "Editar Tutor";
  try {
    const tutor = await tutorApi.buscar(idTutorEmEdicao);
    preencherFormulario(formulario, {
      ...tutor,
      telefone: formatarTelefone(tutor.telefone),
    });
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

async function salvarTutor(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const tutor = lerFormulario(formulario);
  tutor.telefone = normalizarTelefone(tutor.telefone);

  esconderMensagem();
  const erros = validarTutor(tutor);
  mostrarErrosDosCampos(formulario, erros);
  if (Object.keys(erros).length) return;

  const botao = formulario.querySelector("button[type=submit]");
  definirCarregando(botao, true);
  try {
    await enviarTutor(tutor);
    avisarNaProximaPagina(
      idTutorEmEdicao
        ? "Tutor atualizado com sucesso!"
        : "Tutor cadastrado com sucesso!",
    );
    irPara("tutores.html");
  } catch (erro) {
    mostrarMensagem(erro.message);
    definirCarregando(botao, false);
  }
}

function enviarTutor(tutor) {
  return idTutorEmEdicao
    ? tutorApi.editar(idTutorEmEdicao, tutor)
    : tutorApi.inserir(tutor);
}
