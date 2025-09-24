const { query } = require("express");
const { db } = require("../database.js");

exports.getAllObras = (callback) => {
  const query = `
    SELECT
      o.id_obra,
      o.codigo_obra,
      o.descripcion_obra,
      o.tipo_obra,
      tipoO.descripcion AS desc_tipo_obra,
      o.estado_obra,
      te.descripcion_estado AS desc_estado_obra,
      o.id_empresa,
      e.nombre AS nombre_empresa,
      o.fecha_oferta,
      o.observaciones,
      o.observaciones_internas,
      o.fecha_seg,
      o.descripcion_seg,
      o.horas_previstas,
      r.rentabilidadPorcentaje,
      r.gastoGeneral,
      r.ptePedido,
      r.pteFactura,
      r.pteObra,
      r.horasTotal
    
    FROM 
      obras AS o
    
    LEFT JOIN
      empresas AS e ON o.id_empresa = e.id_empresa
    
    LEFT JOIN
      tipoobra AS tipoO ON o.tipo_obra = tipoO.id_tipo
    
    LEFT JOIN
      tipoestadosobras AS te ON o.estado_obra = te.codigo_estado
    
    LEFT JOIN
      rentabilidad AS r ON o.id_obra = r.id_obra
    
    ORDER BY o.codigo_obra;`;

  db.query(query, callback);
};

exports.getObraById = (id, callback) => {
  const query = `
    SELECT
      o.*,
      tipoO.descripcion AS desc_tipo_obra,
      tf.descripcion AS facturable,
      te.descripcion_estado AS desc_estado_obra,
      u.nombre AS nombre_usuario,
      u.apellido1 AS apellido_1_usuario,
      u.apellido2 AS apellido_2_usuario,
      u.codigo_firma AS firma_usuario,
      e.nombre AS nombre_empresa,
      c.nombre_contacto,
      c.apellido1 AS apellido_1_contacto,
      c.apellido2 AS apellido_2_contacto,
      ed.nombre AS nombre_edificio

    FROM 
      obras AS o
    
    LEFT JOIN
      empresas AS e ON o.id_empresa = e.id_empresa
    
    LEFT JOIN
      tipoobra AS tipoO ON o.tipo_obra = tipoO.id_tipo
    
    LEFT JOIN
      tipoestadosobras AS te ON o.estado_obra = te.codigo_estado

    LEFT JOIN
      tipofacturable AS tf ON o.facturable = tf.id_tipo
    
    LEFT JOIN
      usuarios AS u ON o.codigo_usuario_alta = u.codigo_usuario
    
    LEFT JOIN
      contactos AS c ON o.id_contacto = c.id_contacto
    
    LEFT JOIN
      edificios AS ed ON o.id_edificio = ed.id_edificio

    WHERE o.id_obra = ?`;

  db.query(query, [id], callback);
};

exports.createObra = (obra, callback) => {
  const query = `
    INSERT INTO obras (
        codigo_obra,
        descripcion_obra,
        fecha_seg,
        tipo_obra,
        facturable,
        estado_obra,
        fecha_alta,
        codigo_usuario_alta,
        fecha_prevista_fin,
        fecha_oferta,
        horas_previstas,
        gasto_previsto,
        importe,
        viabilidad,
        id_empresa,
        id_contacto,
        id_edificio,
        observaciones,
        observaciones_internas,
        version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

  const values = [
    obra.cod,
    obra.desc,
    obra.fechaSeg,
    obra.tipoObra,
    obra.facturable,
    obra.estadoObra,
    obra.fechaAlta,
    obra.usuarioAlta,
    obra.fechaFin,
    obra.fechaOferta,
    obra.horasPrevistas,
    obra.gastoPrevisto,
    obra.importe,
    obra.viabilidad,
    obra.empresa,
    obra.contacto,
    obra.edificio,
    obra.observaciones,
    obra.observacionesInternas,
  ];

  db.query(query, values, callback);
};

exports.updateObra = (id, data, callback) => {
  const query = `
    UPDATE 
      obras
    SET
      codigo_obra = ?,
      descripcion_obra = ?,
      fecha_seg = ?,
      tipo_obra = ?,
      facturable = ?,
      estado_obra = ?,
      fecha_alta = ?,
      codigo_usuario_alta = ?,
      fecha_prevista_fin = ?,
      fecha_oferta = ?,
      horas_previstas = ?,
      gasto_previsto = ?,
      importe = ?,
      viabilidad = ?,
      id_empresa = ?,
      id_contacto = ?,
      id_edificio = ?,
      observaciones = ?,
      observaciones_internas = ?
    WHERE
      id_obra = ?`;

  const values = [
    data.cod,
    data.desc,
    data.fechaSeg,
    data.tipoObra,
    data.facturable,
    data.estadoObra,
    data.fechaAlta,
    data.usuarioAlta,
    data.fechaFin,
    data.fechaOferta,
    data.horasPrevistas,
    data.gastoPrevisto,
    data.importe,
    data.viabilidad,
    data.empresa,
    data.contacto,
    data.edificio,
    data.observaciones,
    data.observacionesInternas,
    id,
  ];

  db.query(query, values, callback);
};

exports.deleteObra = (id, callback) => {
  const query = `DELETE FROM obras WHERE id_obra = ?`;
  db.query(query, [id], callback);
};
