let tasks = [];

const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const statusSelect = document.getElementById('statusSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        showAlert('Please enter a task!');
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: text,
        priority: prioritySelect.value,
        status: statusSelect.value
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = '';
    prioritySelect.value = 'Medium';
    statusSelect.value = 'To Do';
    taskInput.focus();
}

function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No tasks yet. Add one above!';
        taskList.appendChild(empty);
        return;
    }

    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const taskBlock = document.createElement('div');
    taskBlock.className = 'task-block';
    taskBlock.dataset.id = task.id;

    // "## Task" subheading
    const taskHeading = document.createElement('div');
    taskHeading.className = 'task-heading';
    taskHeading.textContent = '## Task';

    // Container for the task details (indented)
    const details = document.createElement('div');
    details.className = 'task-details';

    // Line with dash and task name
    const dashLine = document.createElement('div');
    dashLine.className = 'dash-line';
    dashLine.innerHTML = `<span class="dash">-</span> <span class="task-name">${task.text}</span>`;

    // Priority label
    const priorityLabel = document.createElement('div');
    priorityLabel.className = 'property-label';
    priorityLabel.textContent = 'Priority';

    // Priority value
    const priorityValue = document.createElement('div');
    priorityValue.className = 'property-value';
    priorityValue.textContent = task.priority;

    // Status value
    const statusValue = document.createElement('div');
    statusValue.className = 'property-value';
    statusValue.textContent = task.status;

    details.appendChild(dashLine);
    details.appendChild(priorityLabel);
    details.appendChild(priorityValue);
    details.appendChild(statusValue);

    taskBlock.appendChild(taskHeading);
    taskBlock.appendChild(details);

    // Left click anywhere on the block (except if it's the empty state) cycles status
    taskBlock.addEventListener('click', (e) => {
        // Do not trigger if clicking inside input areas (but there are none here)
        cycleStatus(task.id);
    });

    // Right click to delete (prevents default context menu)
    taskBlock.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        deleteTask(task.id);
    });

    return taskBlock;
}

function cycleStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const order = ['To Do', 'In Progress', 'Done'];
        const next = (order.indexOf(task.status) + 1) % order.length;
        task.status = order[next];
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

function showAlert(msg) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = msg;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 2000);
}