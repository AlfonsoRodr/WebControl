import { Router } from "express";
import { TipoObraController } from "../controllers/tipoObraController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const tipoObRouter = Router();

tipoObRouter.get("/", TipoObraController.getAll);

tipoObRouter.use(errorHandler);

export default tipoObRouter;
