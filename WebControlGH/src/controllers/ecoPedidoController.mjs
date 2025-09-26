import * as ecoPedidoModel from "../models/ecoPedidoModel.mjs";

export const getPedidoById = async (req, res) => {
  const { idObra } = req.params;
  try {
    const result = await ecoPedidoModel.getPedidoById(idObra);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: `Error al obtener los pedidos de la obra - ${err}`,
    });
  }
};