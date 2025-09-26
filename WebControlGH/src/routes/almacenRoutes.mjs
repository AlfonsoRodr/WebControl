import express from "express";
import * as almacenController from "../controllers/almacenController.mjs";

const router = express.Router();

router.get("/", almacenController.getAllProductos);
router.get("/:id", almacenController.getProductoById);
router.post("/", almacenController.createProducto);
router.put("/:id", almacenController.updateProducto);
router.delete("/:id", almacenController.deletePedido);

export default router;