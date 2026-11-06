const tutorService = require("../services/tutorService");

async function listar(request, response) {
  const tutores = await tutorService.listarTutores();
  response.json(tutores);
}

async function buscarTutor(request, response) {
  const id = request.params.id;
  const tutor = await tutorService.buscarTutor(id);
  if (!tutor)
    return response.status(404).json({ mensagem: "Tutor não encontrado" });
  response.json(tutor);
}

module.exports = { listar, buscarTutor };
