import * as edificioModel from "../models/edificioModel.mjs";

export const getAllEdificios = async (req, res) => {
  try {
    const result = await edificioModel.getAllEdificios();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: `Error al obtener los edificios - ${err}`,
    });
  }
};