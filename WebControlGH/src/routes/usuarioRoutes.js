const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController.mjs");

router.get("/", usuarioController.getAllUsuarios);

module.exports = router ;
