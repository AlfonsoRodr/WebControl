const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS EDIFICIOS

exports.getAllEdificios = (callback) => {
  const query = `
    SELECT
        id_edificio,
        nombre
    FROM edificios
    ORDER BY nombre`;

  db.query(query, callback);
};
