import { Router } from "express";
import { EcoPedidoController } from "../controllers/ecoPedidoController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

const ecoPedidoRouter = Router();

ecoPedidoRouter.get("/:idObra", EcoPedidoController.getByObra);

ecoPedidoRouter.use(errorHandler);

export default ecoPedidoRouter;
