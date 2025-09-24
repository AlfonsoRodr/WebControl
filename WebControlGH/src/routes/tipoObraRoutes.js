const express = require("express");
const router = express.Router();
const tipoObraController = require("../controllers/tipoObraController");

router.get("/", tipoObraController.getAllTiposObra);

module.exports = router ;
