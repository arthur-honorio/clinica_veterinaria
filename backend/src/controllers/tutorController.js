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

module.exports = { listar, buscar, inserir };
