import { db } from "../database.js";

export const getFacturaById = (idObra) => {
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

  return new Promise((resolve, reject) => {
    db.query(query, [idObra], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};