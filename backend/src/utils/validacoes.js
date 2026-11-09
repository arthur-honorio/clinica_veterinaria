function telefoneValido(telefone) {
  const regex = /^\(\d\d\) \d{4,5}\-\d{4}$/;
  return typeof telefone == "string" && regex.test(telefone);
}

function dataValida(data) {
  return !isNaN(new Date(data));
}

function dataNoFuturo(data) {
  return new Date(data) > new Date();
}

module.exports = { telefoneValido, dataValida, dataNoFuturo };
