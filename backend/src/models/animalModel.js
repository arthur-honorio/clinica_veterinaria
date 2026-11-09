const pool = require("../config/db");

async function listar() {
  const resultado = await pool.query(
    'SELECT * FROM animais ORDER BY nome COLLATE "pt-BR-x-icu"',
  );
  return resultado.rows;
}

async function buscar(id) {
  const resultado = await pool.query("SELECT * from animais WHERE id = $1", [
    id,
  ]);
  return resultado.rows[0];
}

async function inserir(animal) {
  const { nome, especie, raca, tutor_id, nascimento } = animal;
  const resultado = await pool.query(
    `INSERT INTO animais (nome, especie, raca, tutor_id, nascimento) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, especie, raca, tutor_id, nascimento],
  );
  return resultado.rows[0];
}

async function editar(id, animal) {
  const { nome, especie, raca, tutor_id, nascimento } = animal;
  const resultado = await pool.query(
    `UPDATE animais set nome = $1, especie = $2, raca = $3, tutor_id = $4, nascimento = $5 where id = $6 RETURNING *`,
    [nome, especie, raca, tutor_id, nascimento, id],
  );
  return resultado.rows[0];
}

async function remover(id) {
  const resultado = await pool.query(
    `DELETE FROM animais WHERE id = $1 RETURNING 1`,
    [id],
  );
  return resultado.rows[0];
}

module.exports = { listar, buscar, inserir, editar, remover };
