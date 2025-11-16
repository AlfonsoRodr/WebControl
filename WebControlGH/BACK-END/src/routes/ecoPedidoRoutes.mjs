import { Router } from "express";
import { EcoPedidoController } from "../controllers/ecoPedidoController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

const ecoPedidoRouter = Router();

ecoPedidoRouter.post("/buscar", EcoPedidoController.getByObras);
ecoPedidoRouter.post("/", EcoPedidoController.create);
ecoPedidoRouter.put("/:idPedido", EcoPedidoController.update);
ecoPedidoRouter.delete("/:idPedido", EcoPedidoController.delete);

ecoPedidoRouter.use(errorHandler);

export default ecoPedidoRouter;
