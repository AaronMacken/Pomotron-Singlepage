// -------------------------------------------------------- ON CLICK EVENTS ---------------------------------------------------------- //

$(document).ready(function() {
  // Load all objects on page load
  $.getJSON("/api/tasks").then(getTasks);

  // Create new object by calling createTask method when user presses enter (keypress 13)
  $(".taskInput").keypress(function(event) {
    if (event.which == 13) {
      createTask();
    }
  });

  // Call inProgress boolean value by calling inProgress fn on clicked li element
  $(".currentList").on("click", "li", function() {
    inProgress($(this));
  });

  // Change isCompleted boolean value by calling isCompleted fn on clicked checkmark's parent element,
  // move front end component from current UL to completed UL
  $(".currentList").on("click", ".complete", function(e) {
    e.stopPropagation();
    isCompleted($(this).parent());
    $(this).parent().remove();
  });

  // Remove element from DB & UL when clicked by caling removeTask fn
  $(".currentList").on("click", ".delete", function(e) {
    e.stopPropagation();
    removeTask($(this).parent());
  });

  // deletes permanent items and temporary ones that are stored in memory
  $(".completedList").on("click", ".delete", function(e) {
    e.stopPropagation();
    removeTask($(this).parent());
    removeTemp($(this).parent().attr("id"));
    $(this).parent().remove();
  });
});

// -------------------------------------------------------- AJAX FUNCTIONS ---------------------------------------------------------- // 



// ---------------------------------------- Get Items From DB ---------------------------------------------------------- // 
function getTasks(tasks) {
  tasks.forEach(function(task) {
    loadTask(task);
  });
}



// --------------------------------- Create html elements from returned JSON & load onto page--------------------------- // 
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
      "<li class='completedIterations' >Completed iterations: " +
      task.completedIterations +
      "</li></ul>" +
      "</li>"
  );

  // jquery memory variables
  newTask.data("id", task._id);
  newTask.data("inProgress", task.inProgress);
  newTask.data("isCompleted", task.isCompleted);
  newTask.data("completedIterations", task.completedIterations);

  // give the html component an ID to select it later
  newTask.attr("id", task._id);

  // if isCompleted bool is true (meaning it had already existed), add it onto completedList instead of currentList
  if (task.isCompleted == true) {
    $(".completedList").append(newTask);
    return;
  }
  if (task.inProgress) {
    newTask.addClass("inProgress");
  }
  // add to currentList
  $(".currentList").append(newTask);
}



// -------------------------- Send post request w/ form value & call load task function ----------------------------- // 

function createTask() {
  let taskName = $("#taskName").val();
  let taskGuess = $("#taskGuess").val();

  if ($("#taskGuess").val() == "") {
    taskGuess = 1;
  }

  let data = {
    name: taskName,
    expectedIterations: taskGuess
  };

  $.post("/api/tasks", data).then(function(newTask) {
    $("#taskName").val("");
    $("#taskGuess").val("");
    loadTask(newTask);
  });
}



// ---------------------------------------- change boolean value of inProgress---------------------------------------- // 

function inProgress(task) {
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


// ---------------------------------------- change boolean value of isCompleted ---------------------------------------- // 
// not the most efficient solution... creates a temporary element on completedList & removes the element on currentList
// when the on click function is fired, causing it to appear that the front end element has moved. 
// What actually happens is the boolean is changed and will only appear on completedList when the page is refreshed via the
// load task method. To combat this we create the temporary html elements to give the illusion of ajax.
// Still, this solution  does not disrupt the flow of the page and all data will still be properly displayed,
// but is it REALLY AJAX? 

function isCompleted(task) {
  let updateUrl = "/api/tasks/" + task.data("id");
  let switchVar = !task.data("isCompleted");
  let updateData = { isCompleted: switchVar, inProgress: false };
  let taskId = task.data("id");

  $.ajax({
    method: "PUT",
    url: updateUrl,
    data: updateData
  }).then(function(updatedTask) {
    task.data("isCompleted", switchVar);

    // Create a temporary object to be stored on the compltedList
    if (updatedTask.isCompleted == true) {
      let newTask = $(
        "<li class='task' >" +
          updatedTask.name +
          '<button class="btn btn--ajax delete"><i class="fas fa-times"></i></button>' +
          '<ul class="nestedList"><li>Expected iterations: ' +
          updatedTask.expectedIterations +
          '<p class="nestedP">&nbsp;/&nbsp;</p>' +
          "</li>" +
          "<li class='completedIterations' >Completed iterations: " +
          updatedTask.completedIterations +
          "</li></ul>" +
          "</li>"
      );

      $(".completedList").append(newTask);
      // temporarily remove from currentList done on the button's on click
      // give this new temporary task li object an id equal to the db objects ID
      newTask.attr("id", taskId);
    }
  });
}



// --------------------- starting function to increment iteration data, gets all objects first ----------------------- //
// this function is called in the stopwatch.js file once the clock hits 0 and clear interval is ran, 
// all items marked as inProgress will have their completedIterations incremented by 1

function incrementIterations() {
  // get all in progress
  $.getJSON("/api/tasks").then(updateInProgress);
}



// ----------------- if task inProgress = true & task is not completed, increment it's iterations by 1 --------------- // 

function updateInProgress(tasks) {
  tasks.forEach(function(task) {
    if (task.inProgress && !task.isCompleted) {
      let updateUrl = "/api/tasks/" + task._id;
      let incrementVal = task.completedIterations + 1;
      let updateData = { completedIterations: incrementVal };
      $.ajax({
        method: "PUT",
        url: updateUrl,
        data: updateData
      }).then(function(updatedTask) {
        $("li#" + task._id + "  .completedIterations").text(
          "Completed iterations: " + incrementVal
        );
      });
    }
  });
}



// ----------------- Remove task from DB, on click function will also remove the html components --------------- // 
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

// ------ Remove a temporary html element. Still sends an AJAX Delete request with the db object's unique ID ------- // 
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
