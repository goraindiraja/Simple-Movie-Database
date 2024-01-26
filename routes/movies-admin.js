const express = require("express");
const Controller = require("../controllers/controller");
const routes = express.Router();

//Untuk bisa menggunakan Multer
const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()})

routes.get("/", Controller.showAllMoviesAdmin);

routes.get("/add", Controller.addMovieForm)
routes.post("/add", upload.single("img"), Controller.postMovieForm)

routes.get("/:id", Controller.movieDetailsAdmin)

routes.get('/:id/edit', Controller.editMovieForm)
routes.post('/:id/edit', Controller.postEditForm)

routes.get('/:id/delete', Controller.deleteMovies)

routes.get('/:id/add-watchlist', Controller.addWatchlistAdmin)


module.exports = routes