const usuarioModel = require("../models/usuarioModel");

exports.getAllUsuarios = (req, res) => {
  usuarioModel.getAllUsuarios((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los usuarios - ${err}`,
      });
    }
    res.json(result);
  });
};