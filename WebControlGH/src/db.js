const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const validator = require("./validations/comprasValidator");

const app = express();
const PORT = 3002; // O el puerto que prefieras

app.disable("x-powered-by");

// Habilitar CORS para permitir el acceso desde el frontend
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "FacturasDB",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

// Endpoint para obtener todas las facturas
app.get("/facturas", (req, res) => {
  const query = `
      SELECT
          f.id, 
          f.origen,
          f.factura_num,
          f.pedido_pos,
          f.obra,
          f.fecha AS fecha_cabecera,
          f.concepto_f,
          f.concepto_l,
          f.cobrado,
          f.importe,
          f.obs_imp
      FROM 
          FacturaDetalle f
      ORDER BY 
          f.factura_num;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.message);
      return res.status(500).json({ error: "Error al obtener las facturas" });
    }

    console.log("Resultados de la consulta:", result);
    const facturas = [];
    let facturaActual = null;

    result.forEach((factura) => {
      facturaActual = {
        id: factura.id,
        origen: factura.origen,
        factura_pos: factura.factura_num,
        pedido_pos: factura.pedido_pos,
        obra: factura.obra,
        fecha_cabecera: factura.fecha_cabecera,
        concepto_f: factura.concepto_f,
        concepto_l: factura.concepto_l,
        cobrado: factura.cobrado,
        importe: factura.importe,
        obs_imp: factura.obs_imp,
      };
      facturas.push(facturaActual);
    });

    res.json(facturas);
  });
});

// Endpoint para obtener una factura específica (cabecera y detalles)
app.get("/facturas/:facturaNum", (req, res) => {
  const { facturaNum } = req.params;

  const query = `
      SELECT 
          c.factura_num,
          c.fecha AS fecha_cabecera,
          f.origen,
          f.pedido_pos,
          f.obra,
          f.concepto_f,
          f.concepto_l,
          f.importe,
          f.cobrado,
          f.iva,
          f.obs_imp
      FROM 
          CabeceraFactura c
      LEFT JOIN 
          FacturaDetalle f ON c.factura_num = f.factura_num
      WHERE 
          c.factura_num = ?
      ORDER BY 
          f.pedido_pos;
  `;

  db.query(query, [facturaNum], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.message);
      return res.status(500).json({ error: "Error al obtener la factura" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const factura = {
      factura_num: result[0].factura_num,
      fecha_cabecera: result[0].fecha_cabecera,
      obra: result[0].obra,
      detalles: result.map((detalle) => ({
        origen: detalle.origen,
        pedido_pos: detalle.pedido_pos,
        concepto_f: detalle.concepto_f,
        concepto_l: detalle.concepto_l,
        importe: detalle.importe,
        cobrado: detalle.cobrado,
        iva: detalle.iva,
        obs_imp: detalle.obs_imp,
      })),
    };

    res.json(factura);
  });
});

// Endpoint para obtener los detalles de una factura específica
app.get("/facturas/:id/detalles", (req, res) => {
  const { id } = req.params;

  const query = `
      SELECT
          f.id, 
          f.origen,
          f.factura_num,
          f.pedido_pos,
          f.obra,
          f.fecha AS fecha_cabecera,
          f.concepto_f,
          f.concepto_l,
          f.cobrado,
          f.importe,
          f.obs_imp,
          f.iva,
          f.importe_base
      FROM 
          FacturaDetalle f
      WHERE 
          f.id = ?
      ORDER BY 
          pedido_pos;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.message);
      return res
        .status(500)
        .json({ error: "Error al obtener los detalles de la factura" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron detalles para esta factura" });
    }
    res.json(result);
  });
});

// Endpoint para actualizar una factura
app.put("/facturas/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { cobrado, importe, obs_imp, importe_base, iva } = req.body;

  const query = `
    UPDATE FacturaDetalle SET cobrado = ?, importe = ?, obs_imp = ?,
    importe_base = ?, iva = ? WHERE id = ? `;

  db.query(
    query,
    [cobrado, importe, obs_imp, importe_base, iva, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar factura:", err);
        return res.status(500).json({ error: "Error al actualizar factura" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }

      res.json({ message: "Factura actualizada correctamente" });
    }
  );
});

// Endpoint para agregar una nueva factura
app.post("/facturas", (req, res) => {
  console.log("Datos recibidos:", req.body);
  const {
    origen,
    fecha,
    pedido_pos,
    obra,
    importe,
    cobrado,
    concepto_f,
    concepto_l,
    obs_imp,
    importe_base,
    iva,
    factura_num,
  } = req.body;

  console.log("Importe Base", importe_base);

  const query = `
    INSERT INTO FacturaDetalle (origen, pedido_pos, obra, fecha, concepto_f, concepto_l, cobrado, importe, obs_imp, importe_base, iva, factura_num) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      origen,
      pedido_pos,
      obra,
      fecha,
      concepto_f,
      concepto_l,
      cobrado,
      importe,
      obs_imp,
      importe_base,
      iva,
      factura_num,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al agregar la factura:", err.message);
        return res.status(500).json({ error: "Error al agregar la factura" });
      }
      res.status(201).json({
        message: "Factura agregada exitosamente",
        id: result.insertId,
      });
    }
  );
});

// Endpoint para eliminar una factura
app.delete("/facturas/:id", (req, res) => {
  const { id } = req.params;

  console.log(id);

  // Primero eliminar los detalles de la factura
  const deleteDetailsQuery = `
    DELETE FROM FacturaDetalle WHERE id = ?
  `;

  db.query(deleteDetailsQuery, [id], (err) => {
    if (err) {
      console.error(
        "Error al eliminar los detalles de la factura:",
        err.message
      );
      return res
        .status(500)
        .json({ error: "Error al eliminar los detalles de la factura" });
    }
    res.json({ message: "Factura eliminada exitosamente" });

    /* Mohamed: De momento lo dejo comentado.

    // Luego eliminar la cabecera de la factura
    const deleteHeaderQuery = `
      DELETE FROM CabeceraFactura WHERE factura_num = ?
    `;

    db.query(deleteHeaderQuery, [facturaNum], (err) => {
      if (err) {
        console.error("Error al eliminar la factura:", err.message);
        return res.status(500).json({ error: "Error al eliminar la factura" });
      }
      res.json({ message: "Factura eliminada exitosamente" });
    });
     */
  });
});

// -- ENDPOINTS DE COMPRAS --
app.get("/compras", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM Compras");
    res.json(rows);
  }
  catch (err) {
    console.error("Error en la consulta SQL:", err.message);
    res.status(500).json({ message: "There was an error in the query" });
  }
});

async function findCompra(numero) {
  const [rows] = await db.promise().query("SELECT * FROM Compras WHERE numero = ?", [numero]);
  return rows.length > 0 ? rows[0] : null;
}

app.get("/compras/:numero", async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await findCompra(numero);

    if (!result) {
      return res.status(404).json({ message: "404 NOT FOUND" });
    }
    return res.json(result);;
  }
  catch (error) {
    console.error("Error en la consulta SQL: ", error.message);
    res.status(500).json({ message: "There was an error in the query" });
  }
});

app.post("/compras", async (req, res) => {
  const result = validator.validateCompra(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const {
    numero,
    fechaFactura,
    concepto,
    proveedor,
    tipo,
    baseIva,
    totalIva,
    asignado,
    totalAsignado,
    observaciones
  } = result.data;

  const query = `INSERT INTO Compras (
      numero, fecha_factura, concepto, proveedor, tipo, base_iva, total_iva, asignado, total_asignado, observaciones
    ) VALUES (?,?,?,?,?,?,?,?,?,?)`;

  try {

    const [dbResult] = await db.promise().query(query, [
      numero,
      new Date(fechaFactura),
      concepto,
      proveedor,
      tipo,
      baseIva,
      totalIva,
      asignado,
      totalAsignado,
      observaciones
    ]);

    return res.status(201).json({
      message: "Compra creada",
      insertId: dbResult.insertId,
      affectedRows: dbResult.affectedRows
    });

  } catch (error) {
    console.error("Error en la consulta SQL: ", error.message);
    return res.status(500).json({ message: "There was an error in the query" });
  }
});

app.put("/compras/:numero", async (req, res) => {
  const { numero } = req.params;

  const compraExistente = await findCompra(numero);
  if (!compraExistente) return res.status(404).json({ message: "NOT FOUND" });

  const result = validator.validateCompra(req.body);
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  try {
    const {
      fechaFactura,
      concepto,
      proveedor,
      tipo,
      baseIva,
      totalIva,
      asignado,
      totalAsignado,
      observaciones
    } = result.data;

    const updateQuery = `
      UPDATE Compras SET 
        fecha_factura = ?, 
        concepto = ?, 
        proveedor = ?, 
        tipo = ?, 
        base_iva = ?, 
        total_iva = ?, 
        asignado = ?, 
        total_asignado = ?, 
        observaciones = ?
      WHERE numero = ?
    `;

    await db.promise().query(updateQuery, [
      new Date(fechaFactura),
      concepto,
      proveedor,
      tipo,
      baseIva,
      totalIva,
      asignado,
      totalAsignado,
      observaciones,
      numero
    ]);

    const compraActualizada = await findCompra(numero);
    return res.status(200).json(compraActualizada);

  }
  catch (error) {
    console.error("Error en la consulta SQL:", error.message);
    return res.status(500).json({ message: "There was an error in the query" });
  }
});

app.patch("/compras/:numero", async (req, res) => {
  const { numero } = req.params;
  const result = await findCompra(numero);

  if (!result) {
    return res.status(404).json({ message: "404 NOT FOUND" });
  }

  const resultValidation = validator.validatePartialCompra(req.body);

  if (!resultValidation.success) {
    return res.status(400).json({ error: JSON.parse(resultValidation.error.message) });
  }

  try {
    const campos = [];
    const valores = [];

    // Se construye una query dinámica solo con los campos que vienen
    for (const [key, value] of Object.entries(resultValidation.data)) {
      let columna = key;
      if (key === "fechaFactura") columna = "fecha_factura";
      if (key === "baseIva") columna = "base_iva";
      if (key === "totalIva") columna = "total_iva";
      if (key === "totalAsignado") columna = "total_asignado";

      campos.push(`${columna} = ?`);
      valores.push(value);
    }

    if (campos.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updateQuery = `UPDATE Compras SET ${campos.join(", ")} WHERE numero = ?`;
    valores.push(numero);

    await db.promise().query(updateQuery, valores);

    // Se devuelve la compra que se ha actualizado.
    const compraActualizada = await findCompra(numero);
    return res.status(200).json(compraActualizada);
  }
  catch (error) {
    console.error("Error en la consulta SQL: ", error.message);
    return res.status(500).json({ message: "There was an error in the query" });
  }
});

app.delete("/compras/:numero", async (req, res) => {
  try {
    const { numero } = req.params;
    const result = await findCompra(numero);

    if (!result) {
      return res.status(404).json({ message: "404 NOT FOUND" });
    }

    await db.promise().query("DELETE FROM Compras WHERE numero = ?", [numero]);
    return res.status(200).json(result);

  }
  catch (error) {
    console.error("Error en la consulta SQL: ", error.message);
    return res.status(500).json({ message: "There was an error in the query" });
  }
});




// --- ENDPOINTS DE INVENTARIO (almacén) ---

// Obtener todos los productos
app.get("/api/inventario", (req, res) => {
  const { nombre } = req.query;
  let query = "SELECT * FROM inventario";
  const values = [];

  if (nombre) {
    query += " WHERE nombre LIKE ?";
    values.push(`%${nombre}%`);
  }

  db.query(query, values, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener productos" });
    res.json(results);
  });
});

// Agregar un producto
app.post("/api/inventario", (req, res) => {
  const { nombre, cantidad, ubicacion } = req.body;
  const query =
    "INSERT INTO inventario (nombre, cantidad, ubicacion) VALUES (?, ?, ?)";
  db.query(query, [nombre, cantidad, ubicacion], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error al agregar producto" });
    res.status(201).json({ message: "Producto agregado", id: result.insertId });
  });
});

// Actualizar producto
app.put("/api/inventario/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, ubicacion } = req.body;
  const query =
    "UPDATE inventario SET nombre = ?, cantidad = ?, ubicacion = ? WHERE id = ?";
  db.query(query, [nombre, cantidad, ubicacion, id], (err) => {
    if (err)
      return res.status(500).json({ error: "Error al actualizar producto" });
    res.json({ message: "Producto actualizado" });
  });
});

// Eliminar producto
app.delete("/api/inventario/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM inventario WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err)
      return res.status(500).json({ error: "Error al eliminar producto" });
    res.json({ message: "Producto eliminado" });
  });
});

// --- ENDPOINTS DE PEDIDOS ---

// Obtener todos los pedidos
app.get("/pedidos", (req, res) => {
  const query = `
  SELECT 
    p.id,
    p.obra,
    p.cliente,
    p.proveedor,
    p.fecha,
    p.estado,
    p.importe,
    p.concepto,
    p.referencia,
    p.observaciones

  FROM 
    Pedidos p`;

  const values = [];

  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    return res.json(results);
  });
});

// Obtener un pedido específico
app.get("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT 
    p.id,
    p.obra,
    p.cliente,
    p.proveedor,
    p.fecha,
    p.estado,
    p.importe,
    p.concepto,
    p.referencia,
    p.observaciones

  FROM 
    Pedidos p
  
  WHERE id = ?`;
  const values = [id];

  db.query(query, values, (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ message: `Error al obtener el pedido ${id} - ${error}` });
    }
    return res.json(result);
  });
});

// Agregar un pedido
app.post("/pedidos", (req, res) => {
  // Extraer información del pedido a crear del cuerpo de la petición. Deben tener el mismo nombre
  const {
    id,
    obra,
    cliente,
    proveedor,
    fecha,
    estado,
    importe,
    concepto,
    referencia,
    observaciones,
  } = req.body;

  const query = `INSERT INTO Pedidos (id, obra, cliente, proveedor, fecha, estado, importe, concepto, referencia, observaciones) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    id,
    obra,
    cliente,
    proveedor,
    fecha,
    estado,
    importe,
    concepto,
    referencia,
    observaciones,
  ];

  db.query(query, values, (error) => {
    if (error) {
      console.error("Error al agregar el pedido", error);
      return res
        .status(500)
        .json({ message: ` Error al agregar el pedido - ${error}` });
    }
    return res.status(201).json({ message: "Pedido agregado correctamente" });
  });
});

// Actualizar un producto
app.put("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const { estado, importe, observaciones } = req.body;
  const query = `UPDATE Pedidos SET estado = ?, importe = ?, observaciones = ? WHERE id = ?`;
  const values = [estado, importe, observaciones, id];
  db.query(query, values, (error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: `Error al actualizar pedido ${id} - ${error}` });
    }
    return res.json({ message: "Pedido actualizado correctamente" });
  });
});

// Borrar un pedido
app.delete("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Pedidos WHERE id = ?`;
  const values = [id];

  db.query(query, values, (error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: `Error al borrar pedido ${id} - ${error}` });
    }
    return res.json({ message: "Pedido borrado correctamente" });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
