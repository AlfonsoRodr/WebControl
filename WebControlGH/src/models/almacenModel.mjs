import { db } from "../database.js";

// MODELO DE NEGOCIO PARA LOS PRODUCTOS DEL ALMACÉN

export const getAllProductos = () => {
	const query = `
    SELECT
        a.id,
        a.codigo,
        a.descripcion,
        a.etiqueta,
        p.NombreProveedor,
        a.fecha_alta,
        f.etiqueta,
        m.etiqueta,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total
    FROM
        almacen AS a
    LEFT JOIN
        proveedores AS p ON a.id_proveedor = p.id
    LEFT JOIN
        familias AS f ON a.id_familia = f.id
    LEFT JOIN
        marcas AS m ON a.id_marca = m.id
    LEFT JOIN
        tipounidad AS tu ON a.id_tipounidad = tu.id
    ORDER BY a.descripcion
  `;

	return new Promise((resolve, reject) => {
		db.query(query, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

export const getProductoById = (id) => {
	const query = `
    SELECT
        a.id,
        a.codigo,
        a.descripcion,
        a.etiqueta,
        p.NombreProveedor,
        a.fecha_alta,
        f.etiqueta,
        m.etiqueta,
        a.stock,
        a.stock_min,
        a.stock_max,
        a.codigo_usuario_alta,
        tu.etiqueta,
        a.precio_minimo,
        a.precio_maximo,
        a.precio_total,
        a.observaciones
    FROM
        almacen AS a
    LEFT JOIN
        proveedores AS p ON a.id_proveedor = p.id
    LEFT JOIN
        familias AS f ON a.id_familia = f.id
    LEFT JOIN
        marcas AS m ON a.id_marca = m.id
    LEFT JOIN
        tipounidad AS tu ON a.id_tipounidad = tu.id
    WHERE a.id = ?
  `;

	return new Promise((resolve, reject) => {
		db.query(query, [id], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

export const createProducto = (producto) => {
	const query = `
    INSERT INTO almacen (codigo, descripcion, etiqueta, id_proveedor, 
    id_familia, id_tipounidad, fecha_alta, codigo_usuario_alta, stock, stock_min, stock_max, id_marca,
    precio_unitario, precio_total, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

	const values = [
		producto.cod,
		producto.descripcion,
		producto.etiqueta,
		producto.proveedor,
		producto.familia,
		producto.tipoUnidad,
		producto.fechaAlta,
		producto.usuarioAlta,
		producto.stock,
		producto.stockMin,
		producto.stockMax,
		producto.marca,
		producto.precioUnitario,
		producto.precioTotal,
		producto.observaciones,
	];

	return new Promise((resolve, reject) => {
		db.query(query, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

export const updateProducto = (id, data) => {
	const query = `
    UPDATE almacen SET
        codigo = ?,
        etiqueta = ?,
        descripcion = ?,
        fecha_alta = ?,
        codigo_usuario_alta = ?,
        id_proveedor = ?,
        id_familia = ?,
        id_marca = ?,
        id_tipounidad = ?,
        precio_unitario = ?,
        stock_min = ?,
        stock_max = ?,
        observaciones = ?
    WHERE id = ?
  `;

	const values = [
		data.cod,
		data.etiqueta,
		data.descripcion,
		data.fechaAlta,
		data.usuarioAlta,
		data.proveedor,
		data.familia,
		data.marca,
		data.tipoUnidad,
		data.precioUnitario,
		data.stockMin,
		data.stockMax,
		data.observaciones,
		id,
	];

	return new Promise((resolve, reject) => {
		db.query(query, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

export const deleteProducto = (id) => {
	const query = `DELETE FROM almacen WHERE id = ?`;

	return new Promise((resolve, reject) => {
		db.query(query, [id], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};