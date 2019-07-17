// -------------------------------------------------------- USING FUNCTIONS ----------------------------------------------------------


$(document).ready(function () {
    // Load all objects
    $.getJSON('/api/tasks').then(getTasks);
    // create new object when enter is pressed on form
    $('#taskInput').keypress(function (event) {
        if (event.which == 13) {
            createTask();
        }
    });
    // update object when list item is clicked
    $('.list').on('click', 'li', function () {
        updateTask($(this));
    });
    // remove object when span is clicked
    $('.list').on('click', '.delete', function (e) {
        e.stopPropagation();
        removeTask($(this).parent());
    });

});

// -------------------------------------------------------- AJAX FUNCTIONS ----------------------------------------------------------


// get all data items from db
function getTasks(tasks) {
    tasks.forEach(function (task) {
        loadTask(task);
    });
}


// '<span class=\'inProg\'>&#10004;</span>'
// create html from the db items
function loadTask(task) {
    // load json info into a list item
    let newTask = $("<li class='task'>" + task.name
        + '<span class=\'delete\'>&#10004;</span>'
        + '<span class=\'reset\'><i class="fas fa-redo"></i></span>'
        + '<span class=\'inProg\'><i class="fas fa-play"></i></span>'
        + '<ul class="nestedList"><li>Expected iterations: ' + task.expectedIterations + '<p class="nestedP">&nbsp;/&nbsp;</p>' + '</li>' + '<li>Completed iterations: '
        + task.completedIterations + '</li></ul>'
        + "</li>");
    // let taskItems = $("<label>" + 'Expected iterations: ' + task.expectedIterations + "</label>"
    // +  "<p>" + 'Completed iterations: ' + task.completedIterations + "</p>")
    // store other json data in jquery memory
    newTask.data('id', task._id);
    newTask.data('inProgress', task.inProgress);
    if (task.inProgress) {
        newTask.addClass('inProgress');
    }
    // add item to unordered list in html
    $(".list").append(newTask);
}

// create a new db object
function createTask() {
    let userInput = $('#taskInput').val();
    $.post('/api/tasks', { name: userInput })
        .then(function (newTask) {
            $('#taskInput').val('');
            loadTask(newTask);
        });
}

// update an existing db object
function updateTask(task) {
    let updateUrl = ('/api/tasks/' + task.data('id'));
    let switchVar = !task.data('inProgress');
    let updateData = { inProgress: switchVar };
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
        .then(function (updatedTask) {
            task.toggleClass('inProgress');
            task.data('inProgress', switchVar);
            console.log(task.data('inProgress'));
        })
}

// remove an existing db object
function removeTask(task) {
    let deleteUrl = ('/api/tasks/' + task.data('id'));
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
        .then(function (data) {
            task.remove();
            console.log(data);
        });
}



