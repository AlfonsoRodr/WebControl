import { ContactoModel } from "../models/contactoModel.mjs";

export class ContactoController {
  static async getByEmpresa(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const contactos = await ContactoModel.getByEmpresa({ idEmpresa });
      res.json({ success: true, data: contactos });
    } catch (error) {
		next(error);
	}
  }
}

