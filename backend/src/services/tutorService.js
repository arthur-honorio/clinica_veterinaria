const tutorModel = require("../models/tutorModel");
const animalModel = require("../models/animalModel");
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

async function editar(id, tutor) {
  await buscar(id);
  validarTutor(tutor);
  return tutorModel.editar(id, tutor);
}

async function remover(id) {
  await buscar(id);
  const animaisTutor = await animalModel.listarAnimaisTutor(id);
  if (animaisTutor.length > 0) {
    throw new ErroDeNegocio(
      "Tutores com animais cadastrados não podem ser removidos",
      409,
    );
  }
  return tutorModel.remover(id);
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

module.exports = { listar, buscar, inserir, editar, remover };
