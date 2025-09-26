import { Router } from "express";
import { GastoController } from "../controllers/gastoController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const gastoRouter = Router();


gastoRouter.get("/por-validar", GastoController.getAllGastosPorValidar);
gastoRouter.get("/por-pagar", GastoController.getAllGastosPorPagar);
gastoRouter.get("/obra/:idObra", GastoController.getGastosByObra);

gastoRouter.use(errorHandler);


