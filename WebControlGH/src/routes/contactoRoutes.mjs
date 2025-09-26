import express from "express";
import * as contactoController from "../controllers/contactoController.mjs";

const router = express.Router();

router.get("/:idEmpresa", contactoController.getContactoByEmpresa);

export default router;