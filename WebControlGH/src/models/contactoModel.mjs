import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS CONTACTOS

export const getContactoByEmpresa = (idEmpresa) => {
	const query = `
    SELECT
        c.id_contacto,
        c.nombre_contacto,
        c.apellido1,
        c.apellido2
    FROM contactos AS c
    LEFT JOIN 
        empresas_contactos AS e_c ON c.id_contacto = e_c.id_contacto
    WHERE
        e_c.id_empresa = ?
    ORDER BY c.nombre_contacto
  `;

	return new Promise((resolve, reject) => {
		db.query(query, [idEmpresa], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};