// dependency vars
const express = require('express'),
    router = express.Router(),
// variable that references the exported functions listed in the given file
    helper = require("../helpers/crudFunctions");

// short hand code for creating multiple routes
// "/" is actually "/api/tasks" - as is defined in the applications main index.js file
// routes are provided with the call back function names listed in the helper file
router.route("/")
.get(helper.getTasks)
.post(helper.createTask);

router.route("/:taskId")
.put(helper.updateTask)
.delete(helper.deleteTask);

// export the router var that gives other files the ability to reach these routes
module.exports = router;