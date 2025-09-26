import express from "express";
import * as ecoFacturaController from "../controllers/ecoFacturaController.js";

const router = express.Router();

router.get("/:idObra", ecoFacturaController.getFacturaById);

export default router;