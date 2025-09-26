import * as almacenModel from "../models/almacenModel.mjs";

export const getAllProductos = async (req, res) => {
	try {
		const result = await almacenModel.getAllProductos();
		res.json(result);
	} catch (err) {
		res
			.status(500)
			.json({ message: `Error al obtener los productos - ${err}` });
	}
};

export const getProductoById = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await almacenModel.getProductoById(id);
		res.json(result[0]);
	} catch (err) {
		res.status(500).json({
			message: `Error al obtener el producto con id ${id} - ${err}`,
		});
	}
};

export const createProducto = async (req, res) => {
	try {
		await almacenModel.createProducto(req.body);
		res.status(201).json({ message: "Producto creado con éxito" });
	} catch (err) {
		res
			.status(500)
			.json({ message: `Error al crear el producto - ${err}` });
	}
};

export const updateProducto = async (req, res) => {
	const { id } = req.params;
	try {
		await almacenModel.updateProducto(id, req.body);
		res.json({ message: "Producto actualizado correctamente" });
	} catch (err) {
		res
			.status(500)
			.json({ message: `Error al actualizar el producto - ${err}` });
	}
};

export const deletePedido = async (req, res) => {
	const { id } = req.params;
	try {
		await almacenModel.deleteProducto(id);
		res.json({ message: "Producto borrado correctamente" });
	} catch (err) {
		res
			.status(500)
			.json({ message: `Error al eliminar el producto - ${err}` });
	}
};