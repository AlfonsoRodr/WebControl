const tipoFacturableModel = require("../models/tipoFacturableModel");

exports.getAllTiposFacturable = (req, res) => {
  tipoFacturableModel.getAllTiposFacturable((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los tipos facturables - ${err}`,
      });
    }
    res.json(result);
  });
};

