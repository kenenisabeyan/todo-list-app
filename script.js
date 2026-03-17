(function() {
  const taskInput = document.getElementById('taskInput');
  const startTime = document.getElementById('startTime');
  const endTime = document.getElementById('endTime');
  const categorySelect = document.getElementById('categorySelect');
  const prioritySelect = document.getElementById('prioritySelect');
  const addBtn = document.getElementById('addTaskBtn');
  const taskTable = document.getElementById('taskTable');
  const searchInput = document.getElementById('searchInput');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const liveRegion = document.getElementById('liveRegion');
  const darkModeBtn = document.getElementById('darkModeBtn');


  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function announce(message) {
    liveRegion.textContent = message;
  }

  // save to localStorage 
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // update progress bar and ARIA attributes 
  function updateProgress() {
    const doneCount = tasks.filter(t => t.completed).length;
    const percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
    progressFill.style.width = percent + '%';
    progressText.textContent = percent + '% completed';

    // Update ARIA on progress container
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuenow', percent);
  }

  // escape HTML to prevent XSS
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"]/g, function(match) {
      if (match === '&') return '&amp;';
      if (match === '<') return '&lt;';
      if (match === '>') return '&gt;';
      if (match === '"') return '&quot;';
      return match;
    });
  }

  // render table based on search filter 
  function render() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(t => t.name.toLowerCase().includes(searchTerm));

    taskTable.innerHTML = '';

    if (filteredTasks.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `<td colspan="8" style="text-align: center; padding: 2rem;">No tasks found</td>`;
      taskTable.appendChild(emptyRow);
    } else {
      filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        if (task.completed) row.classList.add('completed');

        const start = task.start || '—';
        const end = task.end || '—';
        const timeDisplay = (start === '—' && end === '—') ? '—' : `${start} - ${end}`;

        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${escapeHTML(task.name)}</td>
          <td>${escapeHTML(timeDisplay)}</td>
          <td>${escapeHTML(task.category)}</td>
          <td><span class="priority ${task.priority.toLowerCase()}">${escapeHTML(task.priority)}</span></td>
          <td><input type="checkbox" class="done-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark '${escapeHTML(task.name)}' as done"></td>
          <td><button class="action-btn edit-btn" aria-label="Edit task: ${escapeHTML(task.name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></td>
          <td><button class="action-btn delete-btn" aria-label="Delete task: ${escapeHTML(task.name)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
        `;

        // Attach event listeners
        const checkbox = row.querySelector('.done-checkbox');
        checkbox.addEventListener('change', (e) => {
          task.completed = e.target.checked;
          saveTasks();
          render();
          announce(task.completed ? 'Task marked done' : 'Task reopened');
        });

        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
          const newName = prompt('Edit task name', task.name);
          if (newName && newName.trim() !== '') {
            task.name = newName.trim();
            saveTasks();
            render();
            announce('Task updated');
          }
        });

        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          const taskIndex = tasks.findIndex(t => t.name === task.name && t.start === task.start && t.end === task.end);
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            render();
            announce('Task deleted');
          }
        });

        taskTable.appendChild(row);
      });
    }

    updateProgress();
  }

  // add new task 
  function addTask() {
    const name = taskInput.value.trim();
    if (!name) {
      alert('Please enter a task name');
      return;
    }

    tasks.push({
      name: name,
      start: startTime.value,
      end: endTime.value,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false
    });

    // Clear inputs
    taskInput.value = '';
    startTime.value = '';
    endTime.value = '';
    // Keep category/priority as is

    saveTasks();
    render();
    announce('Task added');
    taskInput.focus();
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  // search with debounce
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      render();
    }, 200);
  });

  // dark mode toggle
  darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isPressed = document.body.classList.contains('dark');
    darkModeBtn.setAttribute('aria-pressed', isPressed);
    const icon = darkModeBtn.querySelector('i');
    if (isPressed) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });

  // initial render
  render();

  // set initial dark mode ARIA
  if (document.body.classList.contains('dark')) {
    darkModeBtn.setAttribute('aria-pressed', 'true');
    darkModeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
  } else {
    darkModeBtn.setAttribute('aria-pressed', 'false');
  }
})();