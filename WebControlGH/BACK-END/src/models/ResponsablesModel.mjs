import { db } from "../database.js";

export class ResponsablesModel {
  static async getSubordinadosByManager(managerCodigo) {
    const sql = `
    SELECT u.*
    FROM usuarios u
    JOIN responsables r ON u.codigo_usuario = r.codigo_usuario
    WHERE r.codigo_usuario_manager = ?
    ORDER BY u.nombre, u.apellido1
  `;
    const [rows] = await pool.query(sql, [managerCodigo]);
    return rows;
  }
}
