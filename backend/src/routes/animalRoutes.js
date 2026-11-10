const express = require("express");
const {
  listar,
  listarAnimaisTutor,
  buscar,
  inserir,
  editar,
  remover,
} = require("../controllers/animalController");

const router = express.Router();

router.get("/", listar);
router.get("/:id", buscar);
router.get("/tutor/:tutor_id", listarAnimaisTutor);
router.post("/", inserir);
router.put("/:id", editar);
router.delete("/:id", remover);

module.exports = router;
