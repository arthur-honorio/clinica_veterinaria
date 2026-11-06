const tutorModel = require("../models/tutorModel");

async function listarTutores() {
  return tutorModel.listarTodos();
}

async function buscarTutor(id) {
  return tutorModel.buscarTutor(id);
}

module.exports = { listarTutores, buscarTutor };
