const express = require("express");
const router = express.Router();
const tipoFacturableController = require("../controllers/tipoFacturableController.mjs");

router.get("/", tipoFacturableController.getAllTiposFacturable);

module.exports = router ;
