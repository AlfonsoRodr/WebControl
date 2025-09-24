const express = require("express");
const router = express.Router();

const obraController = require("../controllers/ObraController");

router.get("/", obraController.getAllObras);
router.get("/:idObra", obraController.getObraById);
router.post("/", obraController.createObra);
router.put("/:idObra", obraController.updateObra);
router.delete("/:idObra", obraController.deleteObra);

module.exports = router;