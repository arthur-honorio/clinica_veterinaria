const tutorModel = require("../models/tutorModel");
const { telefoneValido } = require("../utils/validacoes");
const ErroDeNegocio = require("../errors/ErroDeNegocio");

async function listar() {
  return tutorModel.listar();
}

async function buscar(id) {
  const tutor = await tutorModel.buscar(id);
  if (!tutor) {
    throw new ErroDeNegocio("Tutor não encontrado.", 404);
  }
  return tutor;
}

async function inserir(tutor) {
  validarTutor(tutor);
  return tutorModel.inserir(tutor);
}

function validarTutor(tutor) {
  const { nome, telefone, endereco } = tutor;
  if (!nome || !telefone || !endereco) {
    throw new ErroDeNegocio("O tutor deve ter Nome, Telefone e Endereço");
  }
  if (!telefoneValido(telefone)) {
    throw new ErroDeNegocio(
      "Telefone inválido. Formatos aceitos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX",
    );
  }
}

module.exports = { listar, buscar, inserir };
