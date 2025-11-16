import { Router } from "express";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const Responsables = Router();

Responsables.get("/", ResponsablesController.getResponsables);
