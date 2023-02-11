const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies");
const validation = require("../middleware/validade");

router.get("/", moviesController.getAll);

router.get("/:id", moviesController.getSingle);

router.post("/", validation.saveMovie, moviesController.createMovie);

router.put("/:id", validation.saveMovie, moviesController.updateMovie);

router.delete("/:id", moviesController.deleteMovie);

module.exports = router;
