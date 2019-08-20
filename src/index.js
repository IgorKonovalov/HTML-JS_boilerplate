import './style.css';

const timePatternOptions = { hour: '2-digit', minute: '2-digit' };

const newTaskInput = document.getElementById('add-task-input');
const openTasks = document.getElementById('open-tasks');
const doneTasks = document.getElementById('done-tasks');

const addTaskButton = document.getElementById('add-task-button');

const clearOpenListButton = document.getElementById('clear-open-list');
const clearDoneListButton = document.getElementById('clear-done-list');

addTaskButton.addEventListener('click', addNewTask);
newTaskInput.addEventListener('keypress', addNewTask);

function addNewTask(event) {
  if (newTaskInput.value === '') {
    return;
  }

  if (event.srcElement.id === 'add-task-button' || event.code === 'Enter') {
    const newTaskDiv = document.createElement('div');
    newTaskDiv.className = 'task';

    const taskCheckBox = document.createElement('input');
    taskCheckBox.className = 'task-checkbox';
    taskCheckBox.setAttribute('type', 'checkbox');

    taskCheckBox.addEventListener('click', completeTask);

    const taskTitle = document.createElement('div');
    taskTitle.className = 'task-title';
    taskTitle.innerHTML = newTaskInput.value;
    newTaskInput.value = '';

    const tastCreationTime = document.createElement('div');
    tastCreationTime.className = 'task-time';
    tastCreationTime.innerHTML = new Date().toLocaleTimeString("en-US", timePatternOptions);

    newTaskDiv.appendChild(taskCheckBox);
    newTaskDiv.appendChild(taskTitle);
    newTaskDiv.appendChild(tastCreationTime);

    openTasks.insertBefore(newTaskDiv, openTasks.firstChild);
  }
}

function completeTask(event) {
  event.target.removeEventListener('click', completeTask);
  event.target.addEventListener('click', reopenTask);

  const task = event.target.closest('.task');
  doneTasks.insertBefore(task, doneTasks.firstChild);
}

function reopenTask(event) {
  event.target.removeEventListener('click', reopenTask);
  event.target.addEventListener('click', completeTask);

  const task = event.target.closest('.task');
  openTasks.insertBefore(task, openTasks.firstChild);
}

clearOpenListButton.addEventListener('click', function() {
  clearList(openTasks);
});
clearDoneListButton.addEventListener('click', function() {
  clearList(doneTasks);
});

function clearList(taskList) {
  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }
}
