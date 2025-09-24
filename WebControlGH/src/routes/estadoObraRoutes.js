const express = require("express");
const router = express.Router();
const estadoObraController = require("../controllers/estadoObraController");

router.get("/", estadoObraController.getAllEstadosObras);

module.exports = router ;
