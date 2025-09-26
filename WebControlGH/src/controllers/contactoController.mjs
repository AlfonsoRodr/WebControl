import * as contactoModel from "../models/contactoModel.mjs";

export const getContactoByEmpresa = async (req, res) => {
	const { idEmpresa } = req.params;
	try {
		const result = await contactoModel.getContactoByEmpresa(idEmpresa);
		res.json(result);
	} catch (err) {
		res.status(500).json({
			message: `Error al obtener los contactos - ${err}`,
		});
	}
};