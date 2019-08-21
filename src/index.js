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

const searchTasksInput = document.getElementById('search-tasks-input');

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

searchTasksInput.addEventListener('input', filterTasks);

clearOpenListButton.addEventListener('click', function() {
  clearList(openTasks);
});
clearDoneListButton.addEventListener('click', function() {
  clearList(doneTasks);
});

loadSavedTasks();

function addNewTask(event) {
  if (newTaskInput.value === '') {
    return;
  }

  if (event.srcElement.id === 'add-task-button' || event.code === 'Enter') {
    const newTaskTitle = newTaskInput.value;
    const newTaskCreationTime = getCurrentTime();

    const newTaskDiv = createTaskElement(newTaskTitle, newTaskCreationTime);
    openTasks.insertBefore(newTaskDiv, openTasks.firstChild);

    saveList(openTasks);
  }
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', timePatternOptions);
}

function modifyTaskStatus(event) {
  const taskCheckBox = event.target;
  const task = taskCheckBox.closest('.task');

  taskCheckBox.checked ? completeTask(task) : reopenTask(task);

  saveList(openTasks);
  saveList(doneTasks);
}

function completeTask(task) {
  const taskCompletionTime = task.querySelector('.task-completion-time');
  taskCompletionTime.innerHTML = getCurrentTime();

  doneTasks.insertBefore(task, doneTasks.firstChild);
}

function reopenTask(task) {
  const taskCompletionTime = task.querySelector('.task-completion-time');
  taskCompletionTime.innerHTML = '';

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

  saveList(openTasks);
  saveList(doneTasks);
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

    saveList(task.parentElement);
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

function clearList(taskList) {
  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }

  saveList(taskList);
}

function sortTaskList(taskOrdering, list) {
  const orderingValue = taskOrdering.value;
  if (orderingValue === 'text-asc') {
    sortByTitleAsc(list).forEach(task => list.appendChild(task));
  } else if (orderingValue === 'text-desc') {
    sortByTitleAsc(list)
      .reverse()
      .forEach(task => list.appendChild(task));
  } else if (orderingValue === 'date-asc') {
    sortByDateAsc(list).forEach(task => list.appendChild(task));
  } else if (orderingValue === 'date-desc') {
    sortByDateAsc(list)
      .reverse()
      .forEach(task => list.appendChild(task));
  }

  saveList(list);
}

function sortByTitleAsc(list) {
  return Array.from(list.children).sort(function(task1, task2) {
    const task1Title = task1.querySelector('.task-title').innerHTML;
    const task2Title = task2.querySelector('.task-title').innerHTML;
    return task2Title < task1Title ? 1 : -1;
  });
}

function sortByDateAsc(list) {
  return Array.from(list.children).sort(function(task1, task2) {
    const task1TimeString = getTimeStringFromTask(
      task1,
      list.id === 'done-tasks',
    );
    const task2TimeString = getTimeStringFromTask(
      task2,
      list.id === 'done-tasks',
    );
    const task1Time = getTimeFromString(task1TimeString);
    const task2Time = getTimeFromString(task2TimeString);

    return task2Time < task1Time ? 1 : -1;
  });
}

function getTimeStringFromTask(task, done) {
  return done
    ? task.querySelector('.task-creation-time').innerHTML
    : task.querySelector('.task-creation-time').innerHTML;
}

function getTimeFromString(str) {
  const afternoon = str.endsWith('PM');
  const hours12Format = parseInt(str.substring(0, 2));
  const hours24Format = afternoon ? hours12Format + 12 : hours12Format;
  const minutes = parseInt(str.substring(3, 5));
  return Date.parse(`1970-01-01T${hours24Format}:${minutes}:00.000Z`);
}

function filterTasks() {
  const searchTerm = searchTasksInput.value.toLowerCase();
  filterList(searchTerm, openTasks);
  filterList(searchTerm, doneTasks);
}

function filterList(searchTerm, list) {
  Array.from(list.children).forEach(task => {
    const taskTitle = task.querySelector('.task-title').innerHTML.toLowerCase();
    if (taskTitle.includes(searchTerm)) {
      task.classList.remove('hide-block');
    } else {
      task.classList.add('hide-block');
    }
  });
}

function saveList(list) {
  const tasks = Array.from(list.children).map(task => {
    const title = task.querySelector('.task-title').innerHTML;
    const creationTime = task.querySelector('.task-creation-time').innerHTML;
    const completionTimeSection = task.querySelector('.task-completion-time');
    return {
      title: title,
      creationTime: creationTime,
      completionTime: completionTimeSection
        ? completionTimeSection.innerHTML
        : undefined,
    };
  });

  list.id === 'open-tasks'
    ? localStorage.setItem('openTasks', JSON.stringify(tasks))
    : localStorage.setItem('doneTasks', JSON.stringify(tasks));
}

function loadSavedTasks() {
  const openTasksJson = localStorage.getItem('openTasks');
  loadTasksForList(openTasksJson, openTasks);

  const doneTasksJson = localStorage.getItem('doneTasks');
  loadTasksForList(doneTasksJson, doneTasks);
}

function loadTasksForList(tasksJson, list) {
  if (tasksJson) {
    JSON.parse(tasksJson)
      .map(task =>
        createTaskElement(task.title, task.creationTime, task.completionTime),
      )
      .forEach(taskElement => list.appendChild(taskElement));
  }
}

function createTaskElement(title, creationTime, completionTime) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';

  taskDiv.addEventListener('mouseenter', function(event) {
    displayRemoveButton(event, true);
  });
  taskDiv.addEventListener('mouseleave', function(event) {
    displayRemoveButton(event, false);
  });

  const taskCheckBox = document.createElement('input');
  taskCheckBox.className = 'task-checkbox';
  taskCheckBox.setAttribute('type', 'checkbox');
  taskCheckBox.checked = completionTime ? true : false;

  taskCheckBox.addEventListener('click', modifyTaskStatus);

  const taskTitle = document.createElement('div');
  taskTitle.className = 'task-title';
  taskTitle.innerHTML = title;
  newTaskInput.value = '';

  taskTitle.addEventListener('dblclick', modifyTaskTitle);

  const taskRightSection = document.createElement('div');
  taskRightSection.className = 'task-right-section';

  const taskTimeDiv = document.createElement('div');
  taskTimeDiv.className = 'task-time';

  const tastCreationTime = document.createElement('div');
  tastCreationTime.className = 'task-creation-time';
  tastCreationTime.innerHTML = creationTime;

  const taskCompletionTime = document.createElement('div');
  taskCompletionTime.className = 'task-completion-time';
  taskCompletionTime.innerHTML = completionTime ? completionTime : '';

  taskTimeDiv.appendChild(tastCreationTime);
  taskTimeDiv.appendChild(taskCompletionTime);

  const removeTaskButton = document.createElement('img');
  removeTaskButton.className = 'remove-task-img hide-block';
  removeTaskButton.src = '../images/remove-task-img.png';

  removeTaskButton.addEventListener('click', removeTask);

  const alightResetter = document.createElement('div');
  alightResetter.className = 'alight-resetter';

  taskRightSection.appendChild(taskTimeDiv);
  taskRightSection.appendChild(removeTaskButton);

  taskDiv.appendChild(taskCheckBox);
  taskDiv.appendChild(taskTitle);
  taskDiv.appendChild(taskRightSection);
  taskDiv.appendChild(alightResetter);

  return taskDiv;
}
