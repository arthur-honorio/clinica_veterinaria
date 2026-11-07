function telefoneValido(telefone) {
  const regex = /^\(\d\d\) \d{4,5}\-\d{4}$/;
  return typeof telefone == "string" && regex.test(telefone);
}

module.exports = { telefoneValido };
