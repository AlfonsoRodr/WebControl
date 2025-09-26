import { UsuarioModel } from "../models/usuarioModel.mjs";

export class UsuarioController {
  static async getAll(req, res, next) {
    try {
      const usuarios = await UsuarioModel.getAll();
      res.json({ success: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  }
}
