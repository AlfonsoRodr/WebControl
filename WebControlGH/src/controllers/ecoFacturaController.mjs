import { EcoFacturaModel } from "../models/ecoFacturaModel.mjs";

export class EcoFacturaController {
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const facturas = await EcoFacturaModel.getByObra({ idObra });
      res.json({ success: true, data: facturas });
    } catch (error) {
      next(error);
    }
  }
}
