import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const usuarioRouter = Router();

usuarioRouter.get("/", UsuarioController.getAll);

usuarioRouter.use(errorHandler);
