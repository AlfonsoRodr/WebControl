import { db } from "../database.js";

export class UsuarioModel {
  static async getAll() {
    const query = `
    SELECT 
        codigo_usuario,
        nombre,
        apellido1,
        apellido2,
        codigo_firma
    FROM usuarios
    ORDER BY codigo_firma`;

    const [result] = await db.query(query);
    return result;
  }
}
