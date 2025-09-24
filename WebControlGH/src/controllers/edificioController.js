const edificioModel = require("../models/edificioModel");

exports.getAllEdificios = (req, res) => {
  edificioModel.getAllEdificios((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los edificios - ${err}`,
      });
    }
    res.json(result);
  });
};
