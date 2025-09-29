import { db } from "../database.js";

export class EcoPedidoModel {
  static async getByObra({ idObra }) {
    const query = `
    SELECT *
    FROM
        ecopedido
    WHERE id_obra = ?`;

    const [result] = await db.query(query, [idObra]);
    return result;
  }
}
