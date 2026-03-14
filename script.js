// Task array to store todos
let tasks = [];

// DOM elements
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const statusSelect = document.getElementById('statusSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        showAlert('Please enter a task!');
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }
    
    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        priority: prioritySelect.value,
        status: statusSelect.value
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Clear input but keep selections at defaults
    taskInput.value = '';
    prioritySelect.value = 'Medium';
    statusSelect.value = 'To Do';
    taskInput.focus();
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-state';
        emptyMessage.textContent = 'No tasks yet. Add one above!';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Optionally sort by status or priority – here we keep original order
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Function to create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    
    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge ${task.priority.toLowerCase()}`;
    priorityBadge.textContent = task.priority;
    
    // Status badge
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${task.status.toLowerCase().replace(' ', '-')}`;
    statusBadge.textContent = task.status;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    
    // Container for badges and delete button
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    actionsDiv.appendChild(priorityBadge);
    actionsDiv.appendChild(statusBadge);
    actionsDiv.appendChild(deleteBtn);
    
    li.appendChild(taskText);
    li.appendChild(actionsDiv);
    
    // Event: Click on task (but not on delete button) to cycle status
    li.addEventListener('click', (e) => {
        if (e.target !== deleteBtn && !deleteBtn.contains(e.target)) {
            cycleStatus(task.id);
        }
    });
    
    // Event: Delete button
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    return li;
}

// Function to cycle status: To Do -> In Progress -> Done -> To Do
function cycleStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const statuses = ['To Do', 'In Progress', 'Done'];
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        task.status = statuses[nextIndex];
        saveTasks();
        renderTasks();
    }
}

// Function to delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// Function to show alert message
function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 12px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 2000);
}

// Add animation styles for alerts (already in CSS, but keep for safety)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { top: -100px; opacity: 0; }
        to { top: 20px; opacity: 1; }
    }
    @keyframes slideUp {
        from { top: 20px; opacity: 1; }
        to { top: -100px; opacity: 0; }
    }
`;
document.head.appendChild(style);