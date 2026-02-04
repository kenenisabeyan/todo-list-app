// Get elements from HTML
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Add click event
addBtn.addEventListener("click", function () {
  const taskText = taskInput.value.trim();

  // ❗ Prevent empty task
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskText;

  taskList.appendChild(li);

  taskInput.value = "";
});

li.textContent = taskText;

// Mark task as completed on click
li.addEventListener("click", function () {
  li.style.textDecoration = "line-through";
});

// Delete task on right click
li.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  taskList.removeChild(li);
});
