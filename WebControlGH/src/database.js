const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sldk368.piensasolutions.com",
  user: "qaic837",
  port: 3306,
  password: "Abaco2023.",
  database: "qaic837",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

module.exports = { db };