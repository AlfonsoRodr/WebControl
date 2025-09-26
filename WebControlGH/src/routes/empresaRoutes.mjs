import express from "express";
import * as empresaController from "../controllers/empresaController.mjs";

const router = express.Router();

router.get("/", empresaController.getAllEmpresas);

export default router;