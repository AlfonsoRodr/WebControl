const express = require("express");
const router = express.Router();
const tipoFacturableController = require("../controllers/tipoFacturableController.js");

router.get("/", tipoFacturableController.getAllTiposFacturable);

module.exports = router ;
