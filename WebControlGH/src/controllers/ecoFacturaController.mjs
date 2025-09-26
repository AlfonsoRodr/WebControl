import * as ecoFacturaModel from "../models/ecoFacturaModel.mjs";

export const getFacturaById = async (req, res) => {
  const { idObra } = req.params;
  try {
    const result = await ecoFacturaModel.getFacturaById(idObra);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: `Error al obtener las facturas de la obra - ${err}`,
    });
  }
};