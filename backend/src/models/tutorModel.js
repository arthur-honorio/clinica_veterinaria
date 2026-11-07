const pool = require("../config/db");

async function listar() {
  const resultado = await pool.query("SELECT * from tutores ORDER BY nome");
  return resultado.rows;
}

async function buscar(id) {
  const resultado = await pool.query("SELECT * from tutores WHERE id = $1", [
    id,
  ]);
  return resultado.rows[0];
}

async function inserir(tutor) {
  const { nome, telefone, endereco } = tutor;
  const resultado = await pool.query(
    `INSERT INTO tutores (nome, telefone, endereco) VALUES ($1, $2, $3) RETURNING *`,
    [nome, telefone, endereco],
  );
  return resultado.rows[0];
}

module.exports = { listar, buscar, inserir };
