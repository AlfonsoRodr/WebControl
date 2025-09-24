const express = require("express");
const router = express.Router();
const rentabilidadController = require("../controllers/rentabilidadController");

router.get("/:idObra", rentabilidadController.getRentabilidadById);

module.exports = router;
