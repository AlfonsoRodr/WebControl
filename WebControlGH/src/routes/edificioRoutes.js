const express = require("express");
const router = express.Router();
const edificioController = require("../controllers/edificioController.js");

router.get("/", edificioController.getAllEdificios);

module.exports = router ;
