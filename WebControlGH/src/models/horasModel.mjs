import { db } from "../database.js";

// Funciona con varios ids de obras. Necesario para obtener las horas
//  de las obras subordinadas
export class HoraModel {
  static async getByObra({ idsObra }) {
    const placeholders = idsObra.map(() => "?").join(", ");
    const query = `
    SELECT
        h.dia_trabajado,
        u.codigo_firma AS usuario,
        h.id_tarea,
        h.fecha_validacion,
        u2.codigo_firma AS usuario_validacion,
        h.num_horas,
        h.precio_hora
    FROM
        horasobra AS h
    LEFT JOIN
        usuarios AS u ON h.codigo_usuario = u.codigo_usuario
    LEFT JOIN
        usuarios AS u2 ON h.codigo_usuario_validacion = u2.codigo_usuario
    WHERE
        h.id_obra IN (${placeholders})
    `;

    const [result] = await db.query(query, idsObra);
    return result;
  }
}
