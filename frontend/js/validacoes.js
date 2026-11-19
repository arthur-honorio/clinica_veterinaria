// Regras de validação dos formulários (as mesmas que o backend confere).
// Cada função devolve um objeto { campo: "mensagem de erro" }; vazio = tudo certo.

const TELEFONE_REGEX = /^55\d{10,11}$/;

function somenteDigitos(texto) {
  return String(texto ?? "").replace(/\D/g, "");
}

// Aceita "(85) 99999-1111" ou "5585999991111" e devolve "5585999991111".
function normalizarTelefone(valor) {
  const digitos = somenteDigitos(valor);
  const semCodigoDoPais = digitos.length === 10 || digitos.length === 11;
  return semCodigoDoPais ? `55${digitos}` : digitos;
}

function telefoneValido(telefone) {
  return TELEFONE_REGEX.test(telefone);
}

function dataDeHoje() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

function validarObrigatorios(dados, rotulos) {
  const erros = {};
  Object.entries(rotulos).forEach(([campo, rotulo]) => {
    if (!String(dados[campo] ?? "").trim()) {
      erros[campo] = `${rotulo} é obrigatório.`;
    }
  });
  return erros;
}

function validarTutor(tutor) {
  const erros = validarObrigatorios(tutor, {
    nome: "Nome",
    telefone: "Telefone",
    endereco: "Endereço",
  });
  if (!erros.telefone && !telefoneValido(tutor.telefone)) {
    erros.telefone =
      "Telefone inválido. Informe DDD + número, ex.: (85) 99999-1111.";
  }
  return erros;
}

function validarAnimal(animal) {
  const erros = validarObrigatorios(animal, {
    nome: "Nome",
    especie: "Espécie",
    raca: "Raça",
    tutor_id: "Tutor",
    nascimento: "Data de nascimento",
  });
  if (!erros.nascimento && animal.nascimento > dataDeHoje()) {
    erros.nascimento = "A data de nascimento não pode estar no futuro.";
  }
  return erros;
}
