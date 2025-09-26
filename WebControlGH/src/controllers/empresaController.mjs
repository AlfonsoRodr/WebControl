import * as empresaModel from "../models/empresaModel.mjs";

export const getAllEmpresas = async (req, res) => {
  try {
    const result = await empresaModel.getAllEmpresas();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: `Error al obtener las empresas - ${err}`,
    });
  }
};