const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS TIPOS DE FACTURACION

exports.getAllTiposFacturable = (callback) => {
  const query = `
    SELECT 
        id_tipo,
        descripcion
    FROM tipofacturable
    ORDER BY id_tipo`;

  db.query(query, callback);
};
