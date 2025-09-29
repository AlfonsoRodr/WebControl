import { Router } from "express";
import { EcoFacturaController } from "../controllers/ecoFacturaController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

const ecoFacturasRouter = Router();

ecoFacturasRouter.get("/:idObra", EcoFacturaController.getByObra);

ecoFacturasRouter.use(errorHandler);

export default ecoFacturasRouter;
