import { db } from "../database.js";

export class EcoFacturaModel {
  static async getByObra({ idObra }) {
    const query = `
    SELECT 
      f.*,
      p.codigo_pedido
    FROM
      ecofactura AS f
    LEFT JOIN
      ecopedido AS p ON f.id_pedido = p.id_pedido
    WHERE f.id_obra = ?
  `;

    const [result] = await db.query(query, [idObra]);
    return result;
  }
}
