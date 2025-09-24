const estadoObraModel = require("../models/estadoObraModel");

exports.getAllEstadosObras = (req, res) => {
  estadoObraModel.getAllEstadosObra((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los estados de obra - ${err}`,
      });
    }
    res.json(result);
  });
};