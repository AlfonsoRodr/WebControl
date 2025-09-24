const contactoModel = require("../models/contactoModel");

exports.getContactoByEmpresa = (req, res) => {
  const { idEmpresa } = req.params;
  contactoModel.getContactoByEmpresa(idEmpresa, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener los contactos - ${err}`,
      });
    }
    res.json(result);
  });
};
