import { Router } from "express";
import { HoraController } from "../controllers/horasController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const horasRouter = Router();

horasRouter.post("/buscar", HoraController.getByObra);

horasRouter.use(errorHandler);

export default horasRouter;
