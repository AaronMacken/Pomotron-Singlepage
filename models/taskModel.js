// dependency var
const mongoose = require("mongoose");

// expected data for our db objects
var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name cannot be blank."
    },
    inProgress: {
        type: Boolean,
        default: false
    }, 
     isCompleted: {
        type: Boolean,
        default: false
    },
    expectedIterations: {
        type: Number,
        default: 0
    },
    completedIterations: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

// create a model from the schema created above
const Task = mongoose.model("Task", taskSchema);

// export the database model (make it available to files that require it)
module.exports = Task;