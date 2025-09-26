import express from "express";
import * as edificioController from "../controllers/edificioController.mjs";

const router = express.Router();

router.get("/", edificioController.getAllEdificios);

export default router;