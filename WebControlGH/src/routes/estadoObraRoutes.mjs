import express from "express";
import * as estadoObraController from "../controllers/estadoObraController.mjs";

const router = express.Router();

router.get("/", estadoObraController.getAllEstadosObra);

export default router;