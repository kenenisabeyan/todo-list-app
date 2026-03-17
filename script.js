(function() {
  // ----- DOM elements -----
  const taskInput = document.getElementById('taskInput');
  const startTime = document.getElementById('startTime');
  const endTime = document.getElementById('endTime');
  const categorySelect = document.getElementById('categorySelect');
  const prioritySelect = document.getElementById('prioritySelect');
  const addBtn = document.getElementById('addTaskBtn');
  const cancelBtn = document.getElementById('cancelEditBtn');
  const taskTable = document.getElementById('taskTable');
  const searchInput = document.getElementById('searchInput');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const liveRegion = document.getElementById('liveRegion');
  const darkModeBtn = document.getElementById('darkModeBtn');

  // ----- Helper: generate unique ID -----
  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }

  // ----- Load tasks from localStorage (with sample data if empty) -----
  let tasks = [];
  try {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      tasks = JSON.parse(stored);
      // Ensure every task has an id (migrate old data)
      tasks = tasks.map(t => ({ ...t, id: t.id || generateId() }));
    } else {
      // Sample tasks for demonstration
      tasks = [
        { id: generateId(), name: 'Write report', start: '09:00', end: '10:30', category: 'Work', priority: 'High', completed: false },
        { id: generateId(), name: 'Study JavaScript', start: '11:00', end: '12:00', category: 'Study', priority: 'Medium', completed: false },
        { id: generateId(), name: 'Gym workout', start: '18:00', end: '19:00', category: 'Personal', priority: 'Low', completed: true },
      ];
    }
  } catch (e) {
    tasks = [];
  }

  let editingId = null; // id of task being edited, or null

  // ----- Save to localStorage -----
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // ----- Announce for screen readers -----
  function announce(message) {
    liveRegion.textContent = message;
  }

  // ----- Update progress bar -----
  function updateProgress() {
    const doneCount = tasks.filter(t => t.completed).length;
    const percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
    progressFill.style.width = percent + '%';
    progressText.textContent = percent + '% completed';
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.setAttribute('aria-valuenow', percent);
  }

  // ----- Escape HTML to prevent XSS -----
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

  // ----- Reset form to "Add" mode -----
  function resetForm() {
    taskInput.value = '';
    startTime.value = '';
    endTime.value = '';
    categorySelect.value = 'Study';
    prioritySelect.value = 'Medium';
    addBtn.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i> Add';
    cancelBtn.style.display = 'none';
    editingId = null;
  }

  // ----- Fill form with task data for editing -----
  function fillFormForEdit(task) {
    taskInput.value = task.name || '';
    startTime.value = task.start || '';
    endTime.value = task.end || '';
    categorySelect.value = task.category || 'Study';
    prioritySelect.value = task.priority || 'Medium';
    addBtn.innerHTML = '<i class="fa-solid fa-pen" aria-hidden="true"></i> Update';
    cancelBtn.style.display = 'inline-flex';
  }

  // ----- Render the table based on search filter -----
  function render() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filtered = tasks.filter(t => t.name.toLowerCase().includes(searchTerm));

    taskTable.innerHTML = '';

    if (filtered.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="8" style="text-align: center; padding: 2rem;">No tasks found</td>';
      taskTable.appendChild(emptyRow);
    } else {
      filtered.forEach((task, index) => {
        const row = document.createElement('tr');
        if (task.completed) row.classList.add('completed');

        const start = task.start || '—';
        const end = task.end || '—';
        const timeDisplay = (start === '—' && end === '—') ? '—' : `${start} - ${end}`;

        // Use data-id attributes for reliable identification
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${escapeHTML(task.name)}</td>
          <td>${escapeHTML(timeDisplay)}</td>
          <td>${escapeHTML(task.category)}</td>
          <td><span class="priority ${task.priority.toLowerCase()}">${escapeHTML(task.priority)}</span></td>
          <td><input type="checkbox" class="done-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark '${escapeHTML(task.name)}' as done"></td>
          <td><button class="action-btn edit-btn" data-id="${task.id}" aria-label="Edit task: ${escapeHTML(task.name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></td>
          <td><button class="action-btn delete-btn" data-id="${task.id}" aria-label="Delete task: ${escapeHTML(task.name)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
        `;

        taskTable.appendChild(row);
      });

      // Attach event listeners to the newly added elements
      document.querySelectorAll('.done-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const id = e.target.dataset.id;
          const task = tasks.find(t => t.id === id);
          if (task) {
            task.completed = e.target.checked;
            saveTasks();
            render(); // re-render to update strikethrough
            announce(task.completed ? 'Task marked done' : 'Task reopened');
          }
        });
      });

      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const task = tasks.find(t => t.id === id);
          if (task) {
            editingId = id;
            fillFormForEdit(task);
          }
        });
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          tasks = tasks.filter(t => t.id !== id);
          saveTasks();
          if (editingId === id) resetForm(); // if we were editing this task, cancel edit mode
          render();
          announce('Task deleted');
        });
      });
    }

    updateProgress();
  }

  // ----- Add or update task -----
  function addOrUpdateTask() {
    const name = taskInput.value.trim();
    if (!name) {
      alert('Please enter a task name');
      return;
    }

    if (editingId !== null) {
      // Update existing task
      const index = tasks.findIndex(t => t.id === editingId);
      if (index !== -1) {
        tasks[index] = {
          ...tasks[index],
          name: name,
          start: startTime.value,
          end: endTime.value,
          category: categorySelect.value,
          priority: prioritySelect.value,
          // completed status remains unchanged
        };
        announce('Task updated');
      }
    } else {
      // Add new task
      const newTask = {
        id: generateId(),
        name: name,
        start: startTime.value,
        end: endTime.value,
        category: categorySelect.value,
        priority: prioritySelect.value,
        completed: false,
      };
      tasks.push(newTask);
      announce('Task added');
    }

    saveTasks();
    resetForm();
    render();
    taskInput.focus();
  }

  // ----- Event listeners -----
  addBtn.addEventListener('click', addOrUpdateTask);

  cancelBtn.addEventListener('click', () => {
    resetForm();
    announce('Edit cancelled');
  });

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOrUpdateTask();
    }
  });

  // Search with debounce
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      render();
    }, 200);
  });

  // Dark mode toggle
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

  // Initial render
  render();

  // Set initial dark mode ARIA
  if (document.body.classList.contains('dark')) {
    darkModeBtn.setAttribute('aria-pressed', 'true');
    darkModeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
  } else {
    darkModeBtn.setAttribute('aria-pressed', 'false');
  }

  // Hide cancel button initially
  cancelBtn.style.display = 'none';
})();