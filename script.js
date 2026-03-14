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
        const empty = document.createElement('li');
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
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    // Top row: dash + task name + delete button
    const topRow = document.createElement('div');
    topRow.className = 'task-top-row';

    const dash = document.createElement('span');
    dash.className = 'dash';
    dash.textContent = '-';

    const taskName = document.createElement('span');
    taskName.className = 'task-name';
    taskName.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.setAttribute('aria-label', 'Delete task');

    topRow.appendChild(dash);
    topRow.appendChild(taskName);
    topRow.appendChild(deleteBtn);

    // Priority label (exactly as in image)
    const priorityLabel = document.createElement('div');
    priorityLabel.className = 'property-label';
    priorityLabel.textContent = 'Priority';

    // Priority value (badge)
    const priorityValue = document.createElement('div');
    priorityValue.className = `property-value priority-${task.priority.toLowerCase()}`;
    priorityValue.textContent = task.priority;

    // Status value (badge, no label)
    const statusValue = document.createElement('div');
    statusValue.className = `property-value status-${task.status.toLowerCase().replace(' ', '-')}`;
    statusValue.textContent = task.status;

    li.appendChild(topRow);
    li.appendChild(priorityLabel);
    li.appendChild(priorityValue);
    li.appendChild(statusValue);

    // Click on task (except delete) cycles status
    li.addEventListener('click', (e) => {
        if (e.target !== deleteBtn && !deleteBtn.contains(e.target)) {
            cycleStatus(task.id);
        }
    });

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    return li;
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