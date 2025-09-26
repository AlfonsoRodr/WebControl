import express from "express";
import * as ecoPedidoController from "../controllers/ecoPedidoController.mjs";

const router = express.Router();

router.get("/:idObra", ecoPedidoController.getPedidoById);

export default router;