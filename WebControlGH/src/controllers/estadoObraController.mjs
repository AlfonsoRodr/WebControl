import * as estadoObraModel from "../models/estadoObraModel.mjs";

export const getAllEstadosObra = async (req, res) => {
	try {
		const result = await estadoObraModel.getAllEstadosObra();
		res.json(result);
	} 
	catch (error) {
		res.status(500).json({
			message: `Error al obtener los datos de la obra - ${error}`
		});
	}
};