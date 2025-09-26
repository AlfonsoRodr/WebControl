const { db } = require("../database.js");

exports.getAllGastosPorValidar = (callback) => {
  const query = `
        SELECT
            g.*,
            u.codigo_firma AS usuario_alta,
            o.codigo_obra,
            o.descripcion_obra,
            tg.descripcion AS descripcion_gasto,
            u2.codigo_firma AS usuario_validacion,
            u3.codigo_firma AS usuario_pago
        FROM 
            gastosobra AS g
        LEFT JOIN 
            obras AS o ON g.id_obra = o.id_obra
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            usuarios AS u3 ON g.codigo_usuario_pago = u3.codigo_usuario
        WHERE g.codigo_usuario_validacion IS NULL`;

  db.query(query, callback);
};

exports.getAllGastosPorPagar = (callback) => {
  const query = `
        SELECT
            g.*,
            u.codigo_firma AS usuario_alta,
            o.codigo_obra,
            o.descripcion_obra,
            tg.descripcion AS descripcion_gasto,
            u2.codigo_firma AS usuario_validacion,
            u3.codigo_firma AS usuario_pago
        FROM 
            gastosobra AS g
        LEFT JOIN 
            obras AS o ON g.id_obra = o.id_obra
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            usuarios AS u3 ON g.codigo_usuario_pago = u3.codigo_usuario
        WHERE g.codigo_usuario_pago IS NULL`;

  db.query(query, callback);
};

exports.getGastosByObra = (idObra, callback) => {
  const query = `
        SELECT
            g.fecha_gasto,
            u.codigo_firma AS usuario_alta,
            tg.descripcion AS tipo_gasto,
            g.fecha_validacion,
            u2.codigo_firma AS usuario_validacion,
            g.pagado_visa,
            g.fecha_pago,
            g.cantidad,
            g.importe,
            g.observaciones
        FROM
            gastosobra AS g
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        WHERE g.id_obra = ?`;

  db.query(query, [idObra], callback);
};
