import { db } from "../database.js";

export class TipoObraModel {
  static async getAll() {
    const query = `
    SELECT 
        id_tipo,
        descripcion
    FROM tipoobra
    ORDER BY id_tipo`;

    const [result] = await db.query(query);
    return result;
  }
}
