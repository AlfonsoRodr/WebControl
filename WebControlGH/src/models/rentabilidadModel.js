const { db } = require("../database.js");

exports.getRentabilidadById = (idObra, callback) => {
  const query = `
    SELECT 
      r.*,
      o.horas_previstas,
      o.gasto_previsto,
      o.importe
    FROM
        rentabilidad AS r
    LEFT JOIN
      obras AS o ON r.id_obra = o.id_obra
    WHERE r.id_obra = ?`;
  
  db.query(query, idObra, callback);
};


