import { EmpresaModel } from "../models/empresaModel.mjs";

export class EmpresaController {
  static async getAll(req, res, next) {
    try {
      const empresas = await EmpresaModel.getAll();
      res.json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }
}
