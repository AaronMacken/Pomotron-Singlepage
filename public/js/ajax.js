// -------------------------------------------------------- USING FUNCTIONS ----------------------------------------------------------

$(document).ready(function() {
  // Load all objects
  $.getJSON("/api/tasks").then(getTasks);

  // create new object when enter is pressed on form
  $("#taskInput").keypress(function(event) {
    if (event.which == 13) {
      createTask();
    }
  });

  // update object when list item is clicked
  $(".list").on("click", "li", function() {
    updateTask($(this));
  });

  $(".list").on("click", ".complete", function(e) {
    e.stopPropagation();
    moveTask($(this).parent());
    $(this)
      .parent()
      .remove();
  });

//   current task remove
  $(".list").on("click", ".delete", function(e) {
    e.stopPropagation();
    removeTask($(this).parent());
  });

  // completed task remove
//   this list has several remove functions because the displayed object are either
//   A) Permanent items from the database that persist on refresh
//   B) Copies of list items that are temporarily stored in memory - do not persist
//   The first function removes the items that persist, same as above
//   The second function makes an ajax delete request with based off of an ID value that is
//   passed to the temporary list item object. This ID comes from the database's returned ID and is
//   then used to add onto the URL of the ajax end point 
  $(".list2").on("click", ".delete", function(e) {
    e.stopPropagation();
    // console.log($(this).parent().attr('id'));
    removeTask($(this).parent());
    removeTemp($(this).parent().attr('id'));
    $(this)
      .parent()
      .remove();
  });
});

// -------------------------------------------------------- AJAX FUNCTIONS ----------------------------------------------------------

// get all data items from db
function getTasks(tasks) {
  tasks.forEach(function(task) {
    loadTask(task);
  });
}

// create html from the db items
function loadTask(task) {
  // load json info into a list item

  let newTask = $(
    "<li class='task'>" +
      task.name +
      '<button class="btn btn--ajax delete"><i class="fas fa-times"></i></button>' +
      '<button class="btn btn--ajax complete"><i class="fas fa-check"></i></button>' +
      '<ul class="nestedList"><li>Expected iterations: ' +
      task.expectedIterations +
      '<p class="nestedP">&nbsp;/&nbsp;</p>' +
      "</li>" +
      "<li>Completed iterations: " +
      task.completedIterations +
      "</li></ul>" +
      "</li>"
  );

  // jquery memory variables
  newTask.data("id", task._id);
  newTask.data("inProgress", task.inProgress);
  newTask.data("isCompleted", task.isCompleted);

  // if task is completed
  // permanently add to list 2
  if (task.isCompleted == true) {
    $(".list2").append(newTask);
    return;
  }
  if (task.inProgress) {
    newTask.addClass("inProgress");
  }
  $(".list").append(newTask);
}

// create a new db object
function createTask() {
  let userInput = $("#taskInput").val();
  $.post("/api/tasks", { name: userInput }).then(function(newTask) {
    $("#taskInput").val("");
    loadTask(newTask);
  });
}

// update an existing db object
function updateTask(task) {
  let updateUrl = "/api/tasks/" + task.data("id");
  let switchVar = !task.data("inProgress");
  let updateData = { inProgress: switchVar };
  $.ajax({
    method: "PUT",
    url: updateUrl,
    data: updateData
  }).then(function(updatedTask) {
    task.toggleClass("inProgress");
    task.data("inProgress", switchVar);
  });
}

// change bool for data persistence
// call listFilter method
function moveTask(task) {
  let updateUrl = "/api/tasks/" + task.data("id");
  let switchVar = !task.data("isCompleted");
  let updateData = { isCompleted: switchVar };
  let taskId = task.data("id");
  $.ajax({
    method: "PUT",
    url: updateUrl,
    data: updateData
  }).then(function(updatedTask) {
    task.data("isCompleted", switchVar);
    // Create a temporary object to be stored on the complted task list
    if (updatedTask.isCompleted == true) {
      let newTask = $(
        "<li class='task' >" +
          updatedTask.name +
          '<button class="btn btn--ajax delete"><i class="fas fa-times"></i></button>' +
          '<ul class="nestedList"><li>Expected iterations: ' +
          updatedTask.expectedIterations +
          '<p class="nestedP">&nbsp;/&nbsp;</p>' +
          "</li>" +
          "<li>Completed iterations: " +
          updatedTask.completedIterations +
          +taskId +
          "</li></ul>" +
          "</li>"
      );
      $(".list2").append(newTask);
      // temporarily remove from main list done on the button's on click
      // give this new temporary task li object an id equal to the db objects ID
      newTask.attr("id", taskId);
      //   console.log(newTask.attr('id'));
    }
  });
}

// remove an existing db object
function removeTask(task) {
  let deleteUrl = "/api/tasks/" + task.data("id");
  $.ajax({
    method: "DELETE",
    url: deleteUrl
  }).then(function(data) {
    task.remove();
    console.log(data);
  });
}

function removeTemp(tempId) {
  let deleteUrl = "/api/tasks/" + tempId;
  $.ajax({
    method: "DELETE",
    url: deleteUrl
  }).then(function(data) {
    task.remove();
    console.log(data);
  });
}
