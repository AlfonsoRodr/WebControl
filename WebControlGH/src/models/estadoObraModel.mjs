import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS ESTADOS DE OBRA
export class EstadoObraModel {
  static async getAll() {
    const query = `
    SELECT
        codigo_estado,
        descripcion_estado
    FROM tipoestadosobras
    ORDER BY codigo_estado`;

    const [result] = await db.query(query);
    return result;
  }
}
