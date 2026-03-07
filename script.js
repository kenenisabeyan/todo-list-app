// Task array to store todos
let tasks = [];

// DOM elements
const taskInput = document.getElementById('taskInput');
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
    
    // Check for empty task
    if (taskText === '') {
        showAlert('Please enter a task!');
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 500);
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Clear input field
    taskInput.value = '';
    taskInput.focus();
}

// Function to render tasks
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        // Show empty state
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-state';
        emptyMessage.textContent = 'No tasks yet. Add one above!';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Sort tasks: incomplete first, then completed
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    
    // Create task elements
    sortedTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Function to create a task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×'; // Multiplication sign as X
    deleteBtn.setAttribute('aria-label', 'Delete task');
    
    // Event: Left click to toggle completion
    li.addEventListener('click', (e) => {
        // Prevent triggering when clicking delete button
        if (e.target !== deleteBtn) {
            toggleTaskCompletion(task.id);
        }
    });
    
    // Event: Right click to delete (context menu)
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent default context menu
        deleteTask(task.id);
    });
    
    // Event: Click on delete button
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering li click
        deleteTask(task.id);
    });
    
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    return li;
}

// Function to toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Function to delete a task
function deleteTask(taskId) {
    // Show confirmation dialog (optional)
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// Function to show alert message
function showAlert(message) {
    // Create alert element
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
    
    // Remove alert after 2 seconds
    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 2000);
}

// Add animation styles for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 20px;
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            top: 20px;
            opacity: 1;
        }
        to {
            top: -100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optional: Add task count
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // Create or update task counter
    let counter = document.querySelector('.task-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'task-counter';
        counter.style.cssText = `
            margin-top: 15px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        `;
        taskList.parentNode.insertBefore(counter, taskList.nextSibling);
    }
    
    counter.textContent = `${completedTasks}/${totalTasks} tasks completed`;
}

// Modify renderTasks to include task count
const originalRenderTasks = renderTasks;
renderTasks = function() {
    originalRenderTasks();
    if (tasks.length > 0) {
        updateTaskCount();
    } else {
        const counter = document.querySelector('.task-counter');
        if (counter) counter.remove();
    }
};