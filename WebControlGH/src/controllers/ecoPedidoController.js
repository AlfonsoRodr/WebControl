const ecoPedidoModel = require("../models/ecoPedidoModel");

exports.getPedidoById = (req, res) => {
  const { idObra } = req.params;
  ecoPedidoModel.getPedidoById(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los pedidos de la obra - ${err}`,
      });
    }
    res.json(result);
  });
};
