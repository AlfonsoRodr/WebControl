import { Router } from "express";
import { FacturasController } from "../controllers/facturasController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const facturasRouter = Router();

facturasRouter.get("/", FacturasController.getAll);
facturasRouter.get("/:id", FacturasController.getById);
facturasRouter.post("/", FacturasController.create);
facturasRouter.patch("/:id", FacturasController.update);
facturasRouter.delete("/:id", FacturasController.delete);

facturasRouter.use(errorHandler);