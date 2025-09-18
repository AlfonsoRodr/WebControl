const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS TIPOS DE OBRA

exports.getAllTiposObra = (callback) => {
  const query = `
    SELECT 
        id_tipo,
        descripcion
    FROM tipoobra
    ORDER BY id_tipo`;

  db.query(query, callback);
};
