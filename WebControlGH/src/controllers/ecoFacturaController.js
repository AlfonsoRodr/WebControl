const ecoFacturaModel = require("../models/ecoFacturaModel.js");

exports.getFacturaById = (req, res) => {
  const { idObra } = req.params;
  ecoFacturaModel.getFacturaById(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener las facturas de la obra - ${err}`,
      });
    }
    res.json(result);
  });
};
