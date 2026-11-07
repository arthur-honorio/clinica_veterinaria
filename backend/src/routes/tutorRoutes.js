const express = require("express");
const { listar, buscar, inserir } = require("../controllers/tutorController");

const router = express.Router();

router.get("/", listar);
router.get("/:id", buscar);
router.post("/", inserir);

module.exports = router;
