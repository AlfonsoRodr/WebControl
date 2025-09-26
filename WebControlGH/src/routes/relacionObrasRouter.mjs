import { Router } from "express";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";
import { RelacionObrasController } from "../controllers/relacionObrasController.mjs";

export const relacionObrasRouter = Router();

relacionObrasRouter.get("/padre/:idObra", RelacionObrasController.getObraPadre);
relacionObrasRouter.get("/hijas/:idObra", RelacionObrasController.getObrasHijas);
relacionObrasRouter.post("/padre", RelacionObrasController.setObraPadre);
relacionObrasRouter.post("/hijas", RelacionObrasController.setObrasHijas);

relacionObrasRouter.use(errorHandler);

