const { db } = require("../database.js");

exports.getPedidoById = (idObra, callback) => {
  const query = `
    SELECT *
    FROM
        ecopedido
    WHERE id_obra = ?`;
  
  db.query(query, idObra, callback);
};