// Exportar la conexión a la BBDD
const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LAS EMPRESAS
exports.getAllEmpresas = (callback) => {
  const query = `
    SELECT 
        id_empresa,
        nombre,
        direccion,
        telefono1,
        email
    FROM empresas
    ORDER BY nombre`;

  db.query(query, callback);
};
