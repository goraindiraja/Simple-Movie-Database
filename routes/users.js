const express = require("express");
const Controller = require("../controllers/controller");
const routes = express.Router();

routes.get("/", Controller.showAllUsers)
routes.get("/:userId/delete", Controller.deleteUser)

module.exports = routes