import { db } from "../database.js";

export class RentabilidadModel {
  static async getByIdObra({ idObra }) {
    const query = `
    SELECT 
      r.*,
      o.horas_previstas,
      o.gasto_previsto,
      o.importe
    FROM
        rentabilidad AS r
    LEFT JOIN
      obras AS o ON r.id_obra = o.id_obra
    WHERE r.id_obra = ?`;

    const [result] = await db.query(query, [idObra]);
    return result[0] ?? null;
  }
}
