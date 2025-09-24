const empresaModel = require("../models/empresaModel");

exports.getAllEmpresas = (req, res) => {
  empresaModel.getAllEmpresas((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener las empresas - ${err}`,
      });
    }
    res.json(result);
  });
};