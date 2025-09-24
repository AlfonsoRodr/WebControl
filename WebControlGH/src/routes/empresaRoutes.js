const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresaController.js");

router.get("/", empresaController.getAllEmpresas);

module.exports = router ;
