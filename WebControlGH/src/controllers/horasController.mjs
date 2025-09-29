import { HoraModel } from "../models/horasModel.mjs";

export class HoraController {
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const horas = await HoraModel.getByObra({ idObra });
      res.json({ success: true, data: horas });
    } catch (error) {
      next(error);
    }
  }
}
