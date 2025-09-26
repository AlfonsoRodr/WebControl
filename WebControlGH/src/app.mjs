import express from "express";
import cors from "cors";

// Enrutadores
import almacenRouter from "./routes/almacenRoutes.mjs";
import { facturasRouter } from "./routes/FacturasRouter.mjs";
import contactoRouter from "./routes/contactoRoutes.mjs";
import edificioRouter from "./routes/edificioRoutes.mjs";
import empresaRouter from "./routes/empresaRoutes.mjs";
import estadoObraRouter from "./routes/estadoObraRoutes.mjs";
import tipoFacturableRouter from "./routes/tipoFacturableRoutes.js";
import tipoObraRouter from "./routes/tipoObraRoutes.js";
import usuarioRouter from "./routes/usuarioRoutes.js";
import relacionObrasRouter from "./routes/relacionObrasRouter.js";
import obraRouter from "./routes/estadoObraRoutes.mjs";
import rentabilidadRouter from "./routes/rentabilidadRoutes.js";
import ecoFacturaRouter from "./routes/ecoFacturaRoutes.mjs";
import ecoPedidoRouter from "./routes/ecoPedidoRoutes.mjs";

const app = express();
const PORT = 3002;

// Middleware para CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Configuramos los enrutadores
app.use("/api/almacen", almacenRouter);
app.use("/api/facturas", facturasRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/edificio", edificioRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/estado-obra", estadoObraRouter);
app.use("/api/tipo-facturable", tipoFacturableRouter);
app.use("/api/tipo-obra", tipoObraRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/relacion-obras", relacionObrasRouter);
app.use("/api/obra", obraRouter);
app.use("/api/rentabilidad", rentabilidadRouter);
app.use("/api/ecoPedido", ecoPedidoRouter);
app.use("/api/ecoFactura", ecoFacturaRouter);

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});