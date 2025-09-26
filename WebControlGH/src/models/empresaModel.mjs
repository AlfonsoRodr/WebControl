import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LAS EMPRESAS

export const getAllEmpresas = () => {
	const query = `
    SELECT 
        id_empresa,
        nombre,
        direccion,
        telefono1,
        email
    FROM empresas
    ORDER BY nombre
  `;

	return new Promise((resolve, reject) => {
		db.query(query, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};