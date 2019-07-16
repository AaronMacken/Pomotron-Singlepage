// dependency variables
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    sassMiddleware = require('node-sass-middleware');

// body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sass setup
app.use(
    sassMiddleware({
        src: __dirname + '/public/scss',
        dest: __dirname + '/public',
        debug: true
    })
);

// set visible directories
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// any code coming from the thingRoute file will be prefaced with '/api/things'
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


// home route
app.get("/", (req, res) => {
    res.sendFile("index.html");
});

// server listen
app.listen(process.env.PORT || 3000, function () {
    console.log("Sever is listening");
});