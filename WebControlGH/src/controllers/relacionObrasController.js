const relacionObrasModel = require("../models/relacionObrasModel");

exports.getObraPadre = (req, res) => {
  const { idObra } = req.params;
  relacionObrasModel.getObraPadre(idObra, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al obtener el padre de la obra - ${err}` });
    }
    res.json(result);
  });
};

exports.getObrasHijas = (req, res) => {
  const { idObra } = req.params;
  relacionObrasModel.getObrasHijas(idObra, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al obtener las obras hijas - ${err}` });
    }
    res.json(result);
  });
};

exports.setObraPadre = (req, res) => {
  const { idPadre, idHija } = req.body;
  relacionObrasModel.setObraPadre(idPadre, idHija, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al asignar la obra con id ${idPadre} como padre de la obra con id ${idHija} - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.setObrasHijas = (req, res) => {
  const { idPadre, idHijas } = req.body;
  relacionObrasModel.setObrasHijas(idPadre, idHijas, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al asignar las obras hijas a la obra con id ${idPadre} - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.deleteRelaciones = (req, res) => {
  const { idObra } = req.params;
  relacionObrasModel.deleteRelaciones(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al eliminar relaciones de la obra con id ${idObra} - ${err}`,
      });
    }
    res.json(result);
  });
};
