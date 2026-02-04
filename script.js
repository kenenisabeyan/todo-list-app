// Get elements from HTML
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Add click event
addBtn.addEventListener("click", function () {
  const taskText = taskInput.value;

  const li = document.createElement("li");
  li.textContent = taskText;

  taskList.appendChild(li);

  taskInput.value = "";
});
