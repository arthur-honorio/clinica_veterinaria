const express = require("express");
const { listar, buscar, inserir, editar } = require("../controllers/tutorController");

const router = express.Router();

router.get("/", listar);
router.get("/:id", buscar);
router.post("/", inserir);
router.put("/:id", editar);

module.exports = router;
