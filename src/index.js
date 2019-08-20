import './style.css';

const timePatternOptions = { hour: '2-digit', minute: '2-digit' };

const newTaskInput = document.getElementById('add-task-input');
const openTasks = document.getElementById('open-tasks');
const doneTasks = document.getElementById('done-tasks');

const addTaskButton = document.getElementById('add-task-button');

const clearOpenListButton = document.getElementById('clear-open-list');
const clearDoneListButton = document.getElementById('clear-done-list');

const modifyTaskInput = document.createElement('input');

const openTasksOrdering = document.getElementById('open-tasks-ordering');
const doneTasksOrdering = document.getElementById('done-tasks-ordering');

addTaskButton.addEventListener('click', addNewTask);
newTaskInput.addEventListener('keypress', addNewTask);

modifyTaskInput.addEventListener('keypress', processTaskModification);
document.onkeydown = rollbackTaskModification;

openTasksOrdering.addEventListener('change', function(event) {
  sortTaskList(openTasksOrdering, openTasks);
});
doneTasksOrdering.addEventListener('change', function(event) {
  sortTaskList(doneTasksOrdering, doneTasks);
});

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

    taskTitle.addEventListener('dblclick', modifyTaskTitle);

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

function modifyTaskTitle(event) {
  const task = event.target.closest('.task');

  const taskTitle = task.querySelector('.task-title');
  taskTitle.classList.add('hide-block');

  modifyTaskInput.value = taskTitle.innerHTML;
  task.insertBefore(modifyTaskInput, taskTitle);
}

function processTaskModification(event) {
  if (event.code === 'Enter') {
    const task = event.target.closest('.task');
    const taskTitle = task.querySelector('.task-title');

    modifyTaskInput.remove();
    taskTitle.innerHTML = modifyTaskInput.value;
    taskTitle.classList.remove('hide-block');
  }
}

function rollbackTaskModification(event) {
  event = event || window.event;
  if (event.code === 'Escape') {
    const task = modifyTaskInput.closest('.task');
    if (task) {
      const taskTitle = task.querySelector('.task-title');

      modifyTaskInput.remove();

      taskTitle.classList.remove('hide-block');
    }
  }
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

function sortTaskList(taskOrdering, list) {
  const orderingValue = taskOrdering.value;
  if (orderingValue === 'text-asc') {
    sortByTitleAsc(list).forEach(task => list.appendChild(task));
  } else if (orderingValue === 'text-desc') {
    sortByTitleAsc(list)
      .reverse()
      .forEach(task => list.appendChild(task));
  }
}

function sortByTitleAsc(list) {
  return Array.prototype.slice.call(list.children).sort(function(x, y) {
    const xTitle = x.querySelector('.task-title').innerHTML;
    const yTitle = y.querySelector('.task-title').innerHTML;
    return yTitle < xTitle ? 1 : -1;
  });
}
