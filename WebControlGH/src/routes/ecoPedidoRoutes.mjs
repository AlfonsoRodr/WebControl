import express from "express";
import * as ecoPedidoController from "../controllers/ecoPedidoController.js";

const router = express.Router();

router.get("/:idObra", ecoPedidoController.getPedidoById);

export default router;