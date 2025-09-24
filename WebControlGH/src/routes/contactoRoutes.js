const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController.js");

router.get("/:idEmpresa", contactoController.getContactoByEmpresa);

module.exports = router ;
