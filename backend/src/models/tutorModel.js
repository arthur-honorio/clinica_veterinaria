const pool = require("../config/db");

async function listarTodos() {
  const resultado = await pool.query("SELECT * from tutores ORDER BY nome");
  return resultado.rows;
}

async function buscarTutor(id) {
  const resultado = await pool.query("SELECT * from tutores WHERE id = $1", [
    id,
  ]);
  return resultado.rows[0];
}

module.exports = { listarTodos, buscarTutor };
