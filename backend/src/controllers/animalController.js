const animalService = require("../services/animalService");

async function listar(request, response) {
  const animais = await animalService.listar();
  response.json(animais);
}

async function buscar(request, response) {
  const { id } = request.params;
  const animal = await animalService.buscar(id);
  response.json(animal);
}

async function inserir(request, response) {
  const animalCriado = await animalService.inserir(request.body);
  return response.status(201).json(animalCriado);
}

async function editar(request, response) {
  const { id } = request.params;
  const animal = request.body;
  const animalEditado = await animalService.editar(id, animal);
  return response.json(animalEditado);
}

async function remover(request, response) {
  const { id } = request.params;
  await animalService.remover(id);
  return response.status(204).send();
}

module.exports = { listar, buscar, inserir, editar, remover };
