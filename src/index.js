import './style.css';

const timePatternOptions = { hour: '2-digit', minute: '2-digit' };

const newTaskInput = document.getElementById('add-task-input');
const openTasks = document.getElementById('open-tasks');
const doneTasks = document.getElementById('done-tasks');

const addTaskButton = document.getElementById('add-task-button');
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
