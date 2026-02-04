// Connect HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Task storage
let tasks = [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(task => addTaskToList(task));
  }
}

// Add task to UI
function addTaskToList(taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;

  // Mark task as completed
  li.addEventListener("click", function () {
    li.style.textDecoration = "line-through";
  });

  // Delete task on right click
  li.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    taskList.removeChild(li);
    tasks = tasks.filter(task => task !== taskText);
    saveTasks();
  });

  taskList.appendChild(li);
}

// Button click event
addBtn.addEventListener("click", function () {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  tasks.push(taskText);
  saveTasks();
  addTaskToList(taskText);

  taskInput.value = "";
});

// Load tasks when page starts
loadTasks();
