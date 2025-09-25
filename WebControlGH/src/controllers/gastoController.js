const gastosModel = require("../models/gastoModel");

exports.getAllGastosPorValidar = (req, res) => {
  gastosModel.getAllGastosPorValidar((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los gastos por validar - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.getAllGastosPorPagar = (req, res) => {
  gastosModel.getAllGastosPorPagar((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los gastos por pagar - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.getGastosByObra = (req, res) => {
  const { idObra } = req.params;
  gastosModel.getGastosByObra(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los gastos de la obra ${idObra} - ${err}`,
      });
    }
    res.json(result);
  });
};
