import { db } from "../database.js";
import {
  validateObra,
  validatePartialObra,
} from "../validations/obrasValidator.mjs";
import { ValidationError } from "../validations/ValidationError.mjs";

export class ObraModel {
  static async getAll() {
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

    const [result] = await db.query(query);
    return result;
  }

  static async getById({ idObra }) {
    const query = `
    SELECT
      o.*,
      tipoO.descripcion AS desc_tipo_obra,
      tf.descripcion AS desc_facturable,
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

    const [result] = await db.query(query, [idObra]);
    return result;
  }

  static async getByDescripcion({ descripcionObra }) {
    const query = `
    SELECT
      id_obra,
      codigo_obra,
      descripcion_obra
    FROM
      obras
    WHERE
      descripcion_obra LIKE CONCAT('%', ?, '%')`;

    const [result] = await db.query(query, descripcionObra);
    return result;
  }

  static async create({ input }) {
    const validatedData = validateObra(input);

    if (!validatedData.success) {
      // Error personalizado para que lo capture nuesto middleware de gestión de errores
      const error = new Error("Validation Failed");
      error.name = "ValidationError";
      // Lanzamos el error para que lo atrape el controlador
      throw error;
    }

    // Extraemos la info
    const validData = validatedData.data;
    // Extraemos propiedades de la información validada
    const values = Object.values(validData);

    // Query
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

    const [result] = await db.query(query, [...values]);

    // Seleccionamos el registro recién insertado y que vamos a devolver
    // como resultado de la operación de creación
    const [rows] = await db.query(
      `
       SELECT
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
        observaciones_internas
      FROM obras
      WHERE id_obra = ?`,
      [result.insertId]
    );
    return rows[0] ?? null;
  }

  static async update({ idObra, input }) {
    const updatedInfo = validateObra(input);

    if (!updatedInfo.success) {
      throw new ValidationError(
        "Obra con formato inválido",
        updatedInfo.error.issues
      );
    }

    const valid = updatedInfo.data;
    const values = Object.values(valid);

    const query = `
    UPDATE 
      obras
    SET
      codigo_obra = ?,
      descripcion_obra = ?,
      fecha_seg = ?,
      descripcion_seg = ?,
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

    await db.query(query, [...values, idObra]);

    const [rows] = await db.query(
      `
       SELECT
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
        observaciones_internas
      FROM obras
      WHERE id_obra = ?`,
      [idObra]
    );
    return rows[0] ?? null;
  }

  // TEMPORAL -> De momento el usuario por defecto que da de bajas las obras
  // es el usuario 67 (andres_abaco)
  static async delete({ idObra, codigoUsuarioBaja = 67 } = {}) {
    const query = `
    UPDATE obras
    SET
      fecha_baja = NOW(),
      codigo_usuario_baja = ?
    WHERE id_obra = ?
    `;

    const [result] = await db.query(query, [codigoUsuarioBaja, idObra]);

    if (result.affectedRows === 0) {
      return null;
    }
    const [rows] = await db.query(
      `
       SELECT
        codigo_obra,
        descripcion_obra,
        fecha_baja,
        codigo_usuario_baja
      FROM obras
      WHERE id_obra = ?`,
      [idObra]
    );
    return rows[0] ?? null;
  }
}
