const express = require("express");
const tutorController = require("../controllers/tutorController");

const router = express.Router();

router.get("/", tutorController.listar);
router.get("/:id", tutorController.buscarTutor);

module.exports = router;
