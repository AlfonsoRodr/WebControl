import { db } from "../database.js";

export const getPedidoById = (idObra) => {
	const query = `
    SELECT *
    FROM
        ecopedido
    WHERE id_obra = ?
  `;

	return new Promise((resolve, reject) => {
		db.query(query, [idObra], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};