$(document).ready(() => {
 


  let inputForm = $('#action');
  inputForm.focus();


  let tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
  console.log(tasks)

  let init = true;
  tasks.forEach((task) => {
    let $task = createTask(task[0], task[1], task[2], task[3]);
    $('#list').append($task);
  })
  init = false;


  let taskNum = tasks.length > 0 ? +tasks[tasks.length - 1][3] + 1 : 0;

  $('#add').click(addTask);
  $('#clear').click(clear);
  $(window).on('keypress', handleKey);

  function addTask() {
    let action = inputForm.val();

    if (action) {
      let duedate = $('#duedate').val();
      duedate = (new Date(duedate)).toUTCString().slice(0,-13);
      
      let $task = createTask(action, duedate, false, taskNum);
      $('#list').append($task);
      tasks.push([action, duedate, false, taskNum]);
      taskNum += 1;
      localStorage.tasks = JSON.stringify(tasks);
      inputForm.val('').focus();
    }
  }

  function createTask(action, duedate, checked, id) {
    let $task = $('<tr>').addClass('task').attr('id', id);
    let $checkbox = $('<input>').attr('type', 'checkbox').attr('checked', checked).click(checkOffTask);
    let $xMark = $('<a>').attr('href', '#').text('X').addClass('delete').click(deleteTask);
    $task.append($('<td>').text(action))
         .append($('<td>').text(duedate))
         .append($('<td>').append($checkbox).append($xMark));
    if (checked) {
      checkOffTasks.call($task);
    }
    return $task;
  }

  function deleteTask() {
    let $task = $(this).closest('tr');
    let id = $task.attr('id');
    console.log(id)

    tasks.splice(findIndexById(id), 1);
    localStorage.tasks = JSON.stringify(tasks);
    $task.remove();
  }
// wr
  function clear() {
    $('#list .task').remove();
    tasks = [];
    localStorage.removeItem('tasks');
    inputForm.focus();
  }


  // returns the index of the task with the specified ID, or -1 if not found. 
  function findIndexById(id) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i][3] == id) return i;
    }
    return -1;
  }
  function checkOffTask() {
    let id = $(this).closest('tr').attr('id');
    let indexInTasks = findIndexById(id);

    if (!init) {
      tasks[indexInTasks][2] = !tasks[indexInTasks][2];
      localStorage.tasks = JSON.stringify(tasks);
    }

    $(this).closest('tr').children().not(':last').toggleClass('done');
  }

  // Enter adds task for ease of use

  function handleKey(e) {
    if (e.charCode === 13) addTask();
  }
})