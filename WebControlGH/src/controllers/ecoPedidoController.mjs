import { EcoPedidoModel } from "../models/ecoPedidoModel.mjs";

export class EcoPedidoController {
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const pedidos = await EcoPedidoModel.getByObra({ idObra });
      res.json({ success: true, data: pedidos });
    } catch (error) {
      next(error);
    }
  }
}


