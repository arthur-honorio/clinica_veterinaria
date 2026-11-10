function telefoneValido(telefone) {
  const regex = /^55\d{10,11}$/;
  return typeof telefone == "string" && regex.test(telefone);
}

function dataValida(data) {
  return !isNaN(new Date(data));
}

function dataNoFuturo(data) {
  return new Date(data) > new Date();
}

module.exports = { telefoneValido, dataValida, dataNoFuturo };
