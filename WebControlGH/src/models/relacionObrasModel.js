const { db } = require("../database.js");

exports.getObraPadre = (idObra, callback) => {
  const query = `
    SELECT
        id_obraPadre
    FROM 
        relacionobras
    WHERE
        id_obraHija = ?`;

  db.query(query, [idObra], callback);
};

exports.getObrasHijas = (idObra, callback) => {
  const query = `
    SELECT
        id_obraHija
    FROM 
        relacionobras
    WHERE
        id_obraPadre = ?`;

  db.query(query, [idObra], callback);
};

exports.setObraPadre = (idObraPadre, idObraHija, callback) => {
  // Eliminamos primero el padre anterior
  const deleteQuery = `DELETE FROM relacionobras WHERE id_obraHija = ?`;
  db.query(deleteQuery, [idObraHija], (err) => {
    if (err) return callback(err);

    // Ahora establecemos el nuevo padre. Pero primero comprobamos que el campo
    // no esté vacio. Si esta vacio no hacemos el insert
    if (!idObraPadre) return callback(null, deleteResult);

    // Insertar el nuevo padre
    const insertQuery = `
        INSERT INTO relacionobras (
            id_obraPadre,
            id_obraHija
        ) VALUES (?, ?)`;

    db.query(insertQuery, [idObraPadre, idObraHija], callback);
  });
};

exports.setObrasHijas = (idObraPadre, idsObrasHijas, callback) => {
  // Eliminar relaciones hijas actuales
  const deleteQuery = `DELETE FROM relacionobras WHERE id_obraPadre = ?`;
  db.query(deleteQuery, [idObraPadre], (err) => {
    if (err) return callback(err);

    // Insertar nuevas relaciones (si hay hijas)
    if (!Array.isArray(idsObrasHijas) || idsObrasHijas.length === 0) {
      return callback(null, deleteResult);
    }
    const insertQuery = `
      INSERT INTO relacionobras (id_obraPadre, id_obraHija) VALUES ?
    `;
    const values = idsObrasHijas.map((idHija) => [idObraPadre, idHija]);
    db.query(insertQuery, [values], callback);
  });
};

// Cuando se elimina una obra, queremos eliminar todas sus relaciones
exports.deleteRelaciones = (idObra, callback) => {
  const query = `
    DELETE FROM relacionobras
    WHERE id_obraPadre = ? OR id_obraHija = ?`;
  
  db.query(query, [idObra, idObra], callback);
};
