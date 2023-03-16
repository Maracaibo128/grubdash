// The router file defines and exports an instance of Express router.  The router file is only responsible for connecting a path (/) with the route handler for that path (dishesController.list())

const router = require("express").Router();
const controller = require("./dishes.controller")
// Here we are importing the route handler functions from the dishes controller

const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
// using route() allows us to write the path once, and then chain multiple route handlers to that path. we can add post() to the method chain

router.route("/:dishId").get(controller.read).put(controller.update).all(methodNotAllowed);

module.exports = router;
