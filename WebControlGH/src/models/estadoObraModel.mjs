import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS ESTADOS DE OBRA

export const getAllEstadosObra = () => {
	const query = `
    SELECT
        codigo_estado,
        descripcion_estado
    FROM tipoestadosobras
    ORDER BY codigo_estado
  `;

	return new Promise((resolve, reject) => {
		db.query(query, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};