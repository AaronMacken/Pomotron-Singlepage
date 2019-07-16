const db = require("../models");

// index route
exports.getTasks = (req, res) => {
  db.Task.find()
    .then(taskPromises => {
      res.json(taskPromises);
    })
    .catch(err => {
      res.send(err);
    });
};

// crete route
exports.createTask = (req, res) => {
  db.Task.create(req.body)
    .then(newTask => {
      res.status(201).json(newTask);
    })
    .catch(err => {
      res.send(err);
    });
};

// update route
exports.updateTask = (req, res) => {
  db.Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true })
    .then(updatedTask => {
      res.json(updatedTask);
    })
    .catch(err => {
      console.log(err);
    });
};

// destory route
exports.deleteTask = (req, res) => {
    db.Task.remove({_id: req.params.taskId})
    .then(() => {
        res.json({message: "Item deleted"});
    })
    .catch((err) => {
        console.log(err);
    });
}

// export functions (make available to files that require them)
module.exports = exports;
