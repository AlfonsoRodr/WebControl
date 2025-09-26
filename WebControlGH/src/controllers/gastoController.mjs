import { success } from "zod";
import { GastoModel } from "../models/gastoModel.mjs";

export class GastoController {
  static async getAllGastosPorValidar(req, res, next) {
    try {
      const gastosPorValidar = await GastoModel.getAllGastosPorValidar();
      res.json({ success: true, data: gastosPorValidar });
    } catch (error) {
      // Le pasamos el error al middleware ErrorHandler
      next(error);
    }
  }

  static async getAllGastosPorPagar(req, res, next) {
    try {
      const gastosPorPagar = await GastoModel.getAllGastosPorPagar();
      res.json({ success: true, data: gastosPorPagar });
    } catch (error) {
      next(error);
    }
  }

  static async getGastosByObra(req, res, next) {
    const { idObra } = req.params;
    try {
      const gastosPorObra = await GastoModel.getGastosByObra({ idObra });
      res.json({ success: true, data: gastosPorObra });
    } catch (error) {
      next(error);
    }
  }
}
