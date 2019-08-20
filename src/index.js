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

    newTaskDiv.addEventListener('mouseenter', function(event) {
      displayRemoveButton(event, true);
    });
    newTaskDiv.addEventListener('mouseleave', function(event) {
      displayRemoveButton(event, false);
    });

    const taskCheckBox = document.createElement('input');
    taskCheckBox.className = 'task-checkbox';
    taskCheckBox.setAttribute('type', 'checkbox');

    taskCheckBox.addEventListener('click', completeTask);

    const taskTitle = document.createElement('div');
    taskTitle.className = 'task-title';
    taskTitle.innerHTML = newTaskInput.value;
    newTaskInput.value = '';

    const taskRightSection = document.createElement('div');
    taskRightSection.className = 'task-right-section';

    const taskTimeDiv = document.createElement('div');
    taskTimeDiv.className = 'task-time';

    const tastCreationTime = document.createElement('div');
    tastCreationTime.className = 'task-creation-time';
    tastCreationTime.innerHTML = new Date().toLocaleTimeString("en-US", timePatternOptions);

    const removeTaskButton = document.createElement('img');
    removeTaskButton.className = 'remove-task-img hide-block';
    removeTaskButton.src = '../images/remove-task-img.png';

    removeTaskButton.addEventListener('click', removeTask);

    const alightResetter = document.createElement('div');
    alightResetter.className = 'alight-resetter';

    taskTimeDiv.appendChild(tastCreationTime);

    taskRightSection.appendChild(taskTimeDiv);
    taskRightSection.appendChild(removeTaskButton);

    newTaskDiv.appendChild(taskCheckBox);
    newTaskDiv.appendChild(taskTitle);
    newTaskDiv.appendChild(taskRightSection);
    newTaskDiv.appendChild(alightResetter);

    openTasks.insertBefore(newTaskDiv, openTasks.firstChild);
  }
}

function completeTask(event) {
  event.target.removeEventListener('click', completeTask);
  event.target.addEventListener('click', reopenTask);

  const task = event.target.closest('.task');

  const taskTimeDiv = task.querySelector('.task-time');
  const taskCompletionTime = document.createElement('div');
  taskCompletionTime.className = 'task-completion-time';
  taskCompletionTime.innerHTML = new Date().toLocaleTimeString("en-US", timePatternOptions);

  taskTimeDiv.appendChild(taskCompletionTime);

  doneTasks.insertBefore(task, doneTasks.firstChild);
}

function reopenTask(event) {
  event.target.removeEventListener('click', reopenTask);
  event.target.addEventListener('click', completeTask);

  const task = event.target.closest('.task');

  const taskCompletionTime = task.querySelector('.task-completion-time');
  taskCompletionTime.remove();

  openTasks.insertBefore(task, openTasks.firstChild);
}

function displayRemoveButton(event, shouldDisplay) {
  const task = event.target;
  const removeButton = task.querySelector('.remove-task-img');
  shouldDisplay
    ? removeButton.classList.remove('hide-block')
    : removeButton.classList.add('hide-block');
}

function removeTask(event) {
  const task = event.target.closest('.task');
  task.remove();
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
