import { db } from "../database.js";

export class RelacionObrasModel {
  static async getObraPadre({ idObra }) {
    const query = `
    SELECT
        id_obraPadre
    FROM 
        relacionobras
    WHERE
        id_obraHija = ?`;

    const [result] = await db.query(query, [idObra]);
    return result;
  }

  static async getObrasHijas({ idObra }) {
    const query = `
    SELECT
        id_obraHija
    FROM 
        relacionobras
    WHERE
        id_obraPadre = ?`;

    const [result] = await db.query(query, [idObra]);
    return result;
  }

  static async setObraPadre({ idObraPadre, idObraHija }) {
    // Eliminamos primero el padre anterior
    const deleteQuery = `DELETE FROM relacionobras WHERE id_obraHija = ?`;
    await db.query(deleteQuery, [idObraHija]);

    // Si no hay una obra padre especificada
    if (!idObraPadre) {
      return "Obra padre eliminada";
    }

    // Insertar el nuevo padre
    const insertQuery = `
        INSERT INTO relacionobras (
            id_obraPadre,
            id_obraHija
        ) VALUES (?, ?)`;

    await db.query(insertQuery, [idObraPadre, idObraHija]);

    // Devolvemos el resultado de la inserción
    const [rows] = await db.query(
      `
      SELECT *
      FROM relacionobras
      WHERE id_obraPadre = ? AND id_obraHija = ?
      `,
      [idObraPadre, idObraHija]
    );

    return rows[0] ?? null;
  }

  static async setObrasHijas({ idObraPadre, idsObrasHijas }) {
    // Eliminar relaciones hijas actuales
    const deleteQuery = `DELETE FROM relacionobras WHERE id_obraPadre = ?`;
    await db.query(deleteQuery, [idObraPadre]);

    // Insertar nuevas relaciones (si hay hijas)
    if (!Array.isArray(idsObrasHijas) || idsObrasHijas.length === 0) {
      return "Obras hijas eliminadas";
    }

    const insertQuery = `
      INSERT INTO relacionobras (id_obraPadre, id_obraHija) VALUES ?
    `;
    const values = idsObrasHijas.map((idHija) => [idObraPadre, idHija]);
    await db.query(insertQuery, [values]);

    // Devolvemos la inserción
    const [rows] = await db.query(
      `
      SELECT *
      FROM relacionobras
      WHERE id_obraPadre = ?
      `,
      [idObraPadre]
    );

    return rows;
  }
}
