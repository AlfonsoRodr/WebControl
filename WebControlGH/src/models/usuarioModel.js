const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS USUARIOS

exports.getAllUsuarios = (callback) => {
  const query = `
    SELECT 
        codigo_usuario,
        nombre,
        apellido1,
        apellido2,
        codigo_firma
    FROM usuarios
    ORDER BY codigo_firma`;

  db.query(query, callback);
};
