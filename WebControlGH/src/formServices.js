const { db } = require("./database.js");

const formServices = {
  getEmpresas(callback) {
    const query = `
        SELECT 
            id_empresa,
            nombre
        FROM empresas
        ORDER BY nombre`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener las empresas - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getEstadosObra(callback) {
    const query = `
        SELECT
            codigo_estado,
            descripcion_estado
        FROM tipoestadosobras
        ORDER BY codigo_estado`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener los estados de obra - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getTiposObra(callback) {
    const query = `
      SELECT 
        id_tipo,
        descripcion
      FROM tipoobra
      ORDER BY id_tipo`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener los tipos de obra - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getTipoFacturable(callback) {
    const query = `
      SELECT 
        id_tipo,
        descripcion
      FROM tipofacturable
      ORDER BY id_tipo`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener los tipos facturables - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getUsuarioAlta(callback) {
    const query = `
      SELECT 
        codigo_usuario,
        nombre,
        apellido1,
        apellido2,
        codigo_firma
      FROM usuarios
      ORDER BY codigo_firma`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener los usuarios - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getContactos(idEmpresa, callback) {
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

    db.query(query, [idEmpresa], (err, result) => {
      if (err) {
        console.error(`Error al obtener los estados de obrea - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  getComplejos(callback) {
    const query = `
      SELECT
        id_edificio,
        nombre
      FROM edificios
      ORDER BY nombre`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(`Error al obtener los complejos - ${err}`);
        return callback(err, null);
      }
      callback(null, result);
    });
  },
};

module.exports = { formServices };
