import { Router } from "express";
import { TipoFacturableController } from "../controllers/tipoFacturableController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const tiposFacRouter = Router();

tiposFacRouter.get("/", TipoFacturableController.getAll);

tiposFacRouter.use(errorHandler);

export default tiposFacRouter;
