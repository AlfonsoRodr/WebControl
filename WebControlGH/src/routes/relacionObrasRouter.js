const express = require("express");
const router = express.Router();
const relacionObrasController = require("../controllers/relacionObrasController");

router.get("/padre/:idObra", relacionObrasController.getObraPadre);
router.get("/hijas/:idObra", relacionObrasController.getObrasHijas);
router.post("/padre", relacionObrasController.setObraPadre);
router.post("/hijas", relacionObrasController.setObrasHijas);
router.delete("/:idObra", relacionObrasController.deleteRelaciones);

module.exports = router;
