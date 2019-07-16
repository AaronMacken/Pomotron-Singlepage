// dependency vars
const mongoose = require("mongoose");

// allows console statements to be printed by mongoose functions
mongoose.set("debug", true);

// connect db to server
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/productivityApp");

// allows mongoose to use promise syntax
mongoose.Promise = Promise;

// export the database model code from the model file
module.exports.Task = require("./taskModel");