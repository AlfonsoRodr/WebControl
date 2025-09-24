const { db } = require("../database.js");

exports.getFacturaById = (idObra, callback) => {
  const query = `
    SELECT 
      f.*,
      p.codigo_pedido

    FROM
      ecofactura AS f
    
    LEFT JOIN
      ecopedido AS p ON f.id_pedido = p.id_pedido

    WHERE f.id_obra = ?`;
  
  db.query(query, idObra, callback);
};