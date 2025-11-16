import { Router } from "express";
import { EstadoObraController } from "../controllers/estadoObraController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const estadoObRouter = Router();

estadoObRouter.get("/", EstadoObraController.getAll);

estadoObRouter.use(errorHandler);

export default estadoObRouter;
