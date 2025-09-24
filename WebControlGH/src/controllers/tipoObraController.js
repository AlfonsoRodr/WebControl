const tipoObraModel = require("../models/tipoObraModel");

exports.getAllTiposObra = (req, res) => {
  tipoObraModel.getAllTiposObra((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los tipos de obra - ${err}`,
      });
    }
    res.json(result);
  });
};