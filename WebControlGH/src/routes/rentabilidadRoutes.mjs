import { Router } from "express";
import { RentabilidadController } from "../controllers/rentabilidadController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const rentabilidadRouter = Router();

rentabilidadRouter.get("/:idObra", RentabilidadController.getByIdObra);

rentabilidadRouter.use(errorHandler);

