const tutorService = require("../services/tutorService");

async function listar(request, response) {
  const tutores = await tutorService.listar();
  response.json(tutores);
}

async function buscar(request, response) {
  const id = request.params.id;
  const tutor = await tutorService.buscar(id);
  response.json(tutor);
}

async function inserir(request, response) {
  const tutorCriado = await tutorService.inserir(request.body);
  return response.status(201).json(tutorCriado);
}

async function editar(request, response) {
  const id = request.params.id;
  const tutor = request.body;
  const tutorEditado = await tutorService.editar(id, tutor);
  return response.json(tutorEditado);
}

async function remover(request, response) {
  const id = request.params.id;
  await tutorService.remover(id);
  return response.status(204).send();
}

module.exports = { listar, buscar, inserir, editar, remover };
