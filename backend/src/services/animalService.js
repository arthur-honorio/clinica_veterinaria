const animalModel = require("../models/animalModel");
const tutorModel = require("../models/tutorModel");
const ErroDeNegocio = require("../errors/ErroDeNegocio");
const { dataNoFuturo, dataValida } = require("../utils/validacoes");

async function listar() {
  return animalModel.listar();
}

async function buscar(id) {
  const animal = await animalModel.buscar(id);
  if (!animal) {
    throw new ErroDeNegocio("Animal não encontrado.", 404);
  }
  return animal;
}

async function inserir(animal) {
  await validarAnimal(animal);
  return animalModel.inserir(animal);
}

async function editar(id, animal) {
  await buscar(id);
  await validarAnimal(animal);
  return animalModel.editar(id, animal);
}

async function remover(id) {
  await buscar(id);
  return animalModel.remover(id);
}

async function validarAnimal(animal) {
  const { nome, especie, raca, tutor_id, nascimento } = animal;
  if (!nome || !especie || !raca || !tutor_id || !nascimento) {
    throw new ErroDeNegocio(
      "Nome, espécie, raça, tutor e nascimento são obrigatórios",
    );
  }
  if (!dataValida(nascimento) || dataNoFuturo(nascimento)) {
    throw new ErroDeNegocio(
      "A data de nascimento do animal deve ser válida e não pode estar no futuro.",
    );
  }
  const tutor = await tutorModel.buscar(tutor_id);
  if (!tutor) {
    throw new ErroDeNegocio("O tutor informado não foi encontrado");
  }
}

module.exports = { listar, buscar, inserir, editar, remover };
