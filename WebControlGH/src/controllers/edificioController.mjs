import { EdificioModel } from "../models/edificioModel.mjs";

export class EdificioController {
  static async getAll(req, res, next) {
    try {
      const edificios = await EdificioModel.getAll();
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }
}

