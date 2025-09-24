const rentabilidadModel = require("../models/rentabilidadModel");

exports.getRentabilidadById = (req, res) => {
  const { idObra } = req.params;
  rentabilidadModel.getRentabilidadById(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener la rentabilidad de la obra - ${err}`,
      });
    }
    res.json(result);
  });
};
