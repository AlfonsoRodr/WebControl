const express = require("express");
const router = express.Router();
// Controlador del almacen
const almacenController = require("../controllers/almacenController.js");

// No es necesario especificar la ruta completa. En app.js vamos a configurar el router
router.get("/", almacenController.getAllProductos);
router.get("/:id", almacenController.getProductoById);
router.post("/", almacenController.createProducto);
router.put("/:id", almacenController.updateProducto);
router.delete("/:id", almacenController.deletePedido);

module.exports = router ;
