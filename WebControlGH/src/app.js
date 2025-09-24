const express = require("express");
const cors = require("cors");

// Enrutadores
const almacenRouter = require("./routes/almacenRoutes.js");
const { facturasRouter } = require("./routes/FacturasRouter.mjs");

const app = express();
const PORT = 3002;

// Middleware para cors
app.use(cors());
// Middleware para el parsing a JSON de los datos que se envían al servidor
app.use(express.json());

// Configuramos el enrutador almacenRouter para que responda a las URLs /api/almacen
app.use("/api/almacen", almacenRouter);
app.use("/api/facturas", facturasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});