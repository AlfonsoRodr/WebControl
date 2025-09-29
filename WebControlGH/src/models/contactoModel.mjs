import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS CONTACTOS

export class ContactoModel {
  static async getByEmpresa({ idEmpresa }) {
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

    const [result] = await db.query(query, [idEmpresa]);
    return result;
  }
}
