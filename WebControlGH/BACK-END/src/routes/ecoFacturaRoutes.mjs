import { Router } from "express";
import { EcoFacturaController } from "../controllers/ecoFacturaController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

const ecoFacturasRouter = Router();

ecoFacturasRouter.post("/buscar", EcoFacturaController.getByObras);
ecoFacturasRouter.post("/", EcoFacturaController.create);
ecoFacturasRouter.put("/:idFactura", EcoFacturaController.update);
ecoFacturasRouter.delete("/:idFactura", EcoFacturaController.delete);

ecoFacturasRouter.use(errorHandler);

export default ecoFacturasRouter;
