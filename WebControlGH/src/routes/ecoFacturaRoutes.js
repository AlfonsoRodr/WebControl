const express = require("express");
const router = express.Router();
const ecoFacturaController = require("../controllers/ecoFacturaController");

router.get("/:idObra", ecoFacturaController.getFacturaById);

module.exports = router;
