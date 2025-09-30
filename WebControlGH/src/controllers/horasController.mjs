import { HoraModel } from "../models/horasModel.mjs";

export class HoraController {
  static async getByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      if (!Array.isArray(idsObra) || idsObra.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const horas = await HoraModel.getByObra({ idsObra });
      res.json({ success: true, data: horas });
    } catch (error) {
      next(error);
    }
  }
}
