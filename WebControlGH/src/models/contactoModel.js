const { db } = require("../database.js");

// MODELO DE NEGOCIO PARA LOS CONTACTOS

exports.getContactoByEmpresa = (idEmpresa, callback) => {
  const query = `
    SELECT
        c.id_contacto,
        c.nombre_contacto,
        c.apellido1,
        c.apellido2
    FROM contactos AS c
    LEFT JOIN 
        empresas_contactos AS e_c ON c.id_contacto = e_c.id_contacto
    WHERE
        e_c.id_empresa = ?
    ORDER BY c.nombre_contacto`;

  db.query(query, [idEmpresa], callback);
};
