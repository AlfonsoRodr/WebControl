import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS EDIFICIOS

export const getAllEdificios = () => {
	const query = `
    SELECT
        id_edificio,
        nombre
    FROM edificios
    ORDER BY nombre
  `;

	return new Promise((resolve, reject) => {
		db.query(query, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};