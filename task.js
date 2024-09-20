const taskNameInput = document.getElementById('taskName');
const creationDateInput = document.getElementById('creationDate');
const taskDeadlineInput = document.getElementById('taskDeadline');
const taskTypeInput = document.getElementById('taskType');
const taskImage = document.getElementById('taskImage');
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks from localStorage

let isEditing = false;
let editTaskId = null;

document.addEventListener('DOMContentLoaded', displayTasks); // Display tasks when page loads

addTaskBtn.addEventListener('click', () => {
  const taskName = taskNameInput.value;
  const creationDate = creationDateInput.value;
  const taskDeadline = taskDeadlineInput.value;
  const taskType = taskTypeInput.value;
  const taskImageFile = taskImage.files[0];

  if (taskName !== '' && creationDate !== '' && taskDeadline !== '') {
    const task = { id: Date.now(), name: taskName, creationDate, taskDeadline, taskType: taskType || '', imageUrl: null };

    if (taskImageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        task.imageUrl = e.target.result;
        saveTask(task);
      };
      reader.readAsDataURL(taskImageFile);
    } else {
      saveTask(task);
    }
  }
});

function saveTask(task) {
  if (isEditing) {
    tasks = tasks.map(t => t.id === editTaskId ? task : t);
    isEditing = false;
    editTaskId = null;
  } else {
    tasks.push(task);
  }
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to localStorage
  displayTasks();
  resetInputs();
}

function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const tr = document.createElement('tr');

    const taskDetails = `
      <td>${task.name} ${task.imageUrl ? `<img src="${task.imageUrl}" alt="Task Image">` : ''}</td>
      <td>${task.creationDate}</td>
      <td>${task.taskDeadline}</td>
      <td>${task.taskType}</td>
      <td>
        <button class="update-btn" onclick="editTask(${task.id})">Update</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    tr.innerHTML = taskDetails;
    taskList.appendChild(tr);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Update localStorage
  displayTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);

  taskNameInput.value = task.name;
  creationDateInput.value = task.creationDate;
  taskDeadlineInput.value = task.taskDeadline;
  taskTypeInput.value = task.taskType;

  if (task.imageUrl) {
    taskImage.value = task.imageUrl;
  }

  isEditing = true;
  editTaskId = id;
}

function resetInputs() {
  taskNameInput.value = '';
  creationDateInput.value = '';
  taskDeadlineInput.value = '';
  taskTypeInput.value = '';
  taskImage.value = null;
}
