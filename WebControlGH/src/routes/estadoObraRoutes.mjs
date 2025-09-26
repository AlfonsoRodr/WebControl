import express from "express";
import * as estadoObraController from "../controllers/estadoObraController.js";

const router = express.Router();

router.get("/", estadoObraController.getAllEstadosObras);

export default router;