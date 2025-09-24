const express = require("express");
const router = express.Router();
const ecoPedidoController = require("../controllers/ecoPedidoController");

router.get("/:idObra", ecoPedidoController.getPedidoById);

module.exports = router;
