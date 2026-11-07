class ErroDeNegocio extends Error {
  constructor(mensagem, status = 400) {
    super(mensagem);
    this.status = status;
  }
}

module.exports = ErroDeNegocio;
