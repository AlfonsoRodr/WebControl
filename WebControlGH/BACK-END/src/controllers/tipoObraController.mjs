import { TipoObraModel } from "../models/tipoObraModel.mjs";

export class TipoObraController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoObraModel.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}
