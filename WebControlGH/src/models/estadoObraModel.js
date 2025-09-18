const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS ESTADOS DE OBRA

exports.getAllEstadosObra = (callback) => {
  const query = `
    SELECT
        codigo_estado,
        descripcion_estado
    FROM tipoestadosobras
    ORDER BY codigo_estado`;

  db.query(query, callback);
};
