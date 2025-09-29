import { Router } from "express";
import { AlmacenController } from "../controllers/almacenController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const almacenRouter = Router();

almacenRouter.get("/", AlmacenController.getAll);
almacenRouter.get("/:idProducto", AlmacenController.getById);
almacenRouter.post("/", AlmacenController.create);
almacenRouter.put("/:idProducto", AlmacenController.update);
almacenRouter.delete("/:idProducto", AlmacenController.delete);

almacenRouter.use(errorHandler);

export default almacenRouter;
