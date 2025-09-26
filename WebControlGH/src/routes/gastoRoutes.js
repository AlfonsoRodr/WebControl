const express = require("express");
const router = express.Router();
const gastosController = require("../controllers/gastoController.js");

router.get("/por-validar", gastosController.getAllGastosPorValidar);
router.get("/por-pagar", gastosController.getAllGastosPorPagar);
router.get("/obra/:idObra", gastosController.getGastosByObra);

module.exports = router;
