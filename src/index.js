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

    const taskCheckBox = document.createElement('input');
    taskCheckBox.setAttribute('type', 'checkbox');

    const taskTitle = document.createElement('div');
    taskTitle.innerHTML = newTaskInput.value;
    newTaskInput.value = '';

    const tastCreationTime = document.createElement('div');
    tastCreationTime.innerHTML = new Date().toLocaleTimeString("en-US", timePatternOptions);

    newTaskDiv.appendChild(taskCheckBox);
    newTaskDiv.appendChild(taskTitle);
    newTaskDiv.appendChild(tastCreationTime);

    openTasks.appendChild(newTaskDiv);
  }
}
