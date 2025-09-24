const obraModel = require("../models/ObraModel.js");

exports.getAllObras = (req, res) => {
  obraModel.getAllObras((err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener las obras - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.getObraById = (req, res) => {
  const { idObra } = req.params;
  obraModel.getObraById(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener la obra con id ${idObra} - ${err}`,
      });
    }
    res.json(result);
  });
};

exports.createObra = (req, res) => {
  const newObra = req.body;
  obraModel.createObra(newObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al crear la obra - ${err}`,
      });
    }
    res.json({ message: " Obra creada exitosamente" });
  });
};

exports.updateObra = (req, res) => {
  const { idObra } = req.params;
  const obraData = req.body;
  obraModel.updateObra(idObra, obraData, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al actualizar la obra con id ${idObra} - ${err}`,
      });
    }
    res.json({ message: " Obra actualizada exitosamente " });
  });
};

exports.deleteObra = (req, res) => {
  const { idObra } = req.params;
  obraModel.deleteObra(idObra, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al eliminar la obra con id ${idObra} - ${err}`,
      });
    }
    res.json({ message: " Obra eliminada exitosamente " });
  });
};
