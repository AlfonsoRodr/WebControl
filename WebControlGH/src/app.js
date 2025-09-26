const express = require("express");
const cors = require("cors");

// Enrutadores
const almacenRouter = require("./routes/almacenRoutes.js");
const { facturasRouter } = require("./routes/FacturasRouter.mjs");
const contactoRouter = require("./routes/contactoRoutes.js");
const edificioRouter = require("./routes/edificioRoutes.js");
const empresaRouter = require("./routes/empresaRoutes.js");
const estadoObraRouter = require("./routes/estadoObraRoutes.js");
const { tiposFacRouter } = require("./routes/tipoFacturableRoutes.mjs");
const { tipoObRouter } = require("./routes/tipoObraRoutes.mjs");
const { usuarioRouter } = require("./routes/usuarioRoutes.mjs");
const { relacionObrasRouter } = require("./routes/relacionObrasRouter.mjs");
const { obraRouter } = require("./routes/obraRoutes.mjs");
const { rentabilidadRouter } = require("./routes/rentabilidadRoutes.mjs");
const ecoFacturaRouter = require("./routes/ecoFacturaRoutes.js");
const ecoPedidoRouter = require("./routes/ecoPedidoRoutes.js");
const { gastoRouter } = require("./routes/gastoRouter.mjs");

const app = express();
const PORT = 3002;

// Middleware para cors
app.use(cors());
// Middleware para el parsing a JSON de los datos que se envían al servidor
app.use(express.json());

// Configuramos los enrutadores para que responda a las URLs especificadas
app.use("/api/almacen", almacenRouter);
app.use("/api/facturas", facturasRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/edificio", edificioRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/estado-obra", estadoObraRouter);
app.use("/api/tipo-facturable", tiposFacRouter);
app.use("/api/tipo-obra", tipoObRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/relacion-obras", relacionObrasRouter);
app.use("/api/obra", obraRouter);
app.use("/api/rentabilidad", rentabilidadRouter);
app.use("/api/ecoPedido", ecoPedidoRouter);
app.use("/api/ecoFactura", ecoFacturaRouter);
app.use("/api/gastos", gastoRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
