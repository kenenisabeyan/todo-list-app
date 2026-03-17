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
    return crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // ----- state -----
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let editingId = null; // id of task being edited, or null

  // ----- helper: announce to screen readers -----
  function announce(message) {
    liveRegion.textContent = message;
  }

  // ----- save to localStorage -----
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // ----- update progress bar and ARIA attributes -----
  function updateProgress() {
    const doneCount = tasks.filter(t => t.completed).length;
    const percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
    progressFill.style.width = percent + '%';
    progressText.textContent = percent + '% completed';

    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuenow', percent);
  }

  // ----- escape HTML to prevent XSS -----
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

  // ----- reset form to empty, hide cancel, set add button text -----
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

  // ----- fill form with task data for editing -----
  function fillFormForEdit(task) {
    taskInput.value = task.name || '';
    startTime.value = task.start || '';
    endTime.value = task.end || '';
    categorySelect.value = task.category || 'Study';
    prioritySelect.value = task.priority || 'Medium';
    addBtn.innerHTML = '<i class="fa-solid fa-pen" aria-hidden="true"></i> Update';
    cancelBtn.style.display = 'inline-flex';
  }

  // ----- render table based on search filter -----
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
          <td><button class="action-btn edit-btn" data-id="${task.id}" aria-label="Edit task: ${escapeHTML(task.name)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button></td>
          <td><button class="action-btn delete-btn" data-id="${task.id}" aria-label="Delete task: ${escapeHTML(task.name)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
        `;

        // Attach event listeners
        const checkbox = row.querySelector('.done-checkbox');
        checkbox.addEventListener('change', (e) => {
          task.completed = e.target.checked;
          saveTasks();
          render(); // re-render to update class and progress
          announce(task.completed ? 'Task marked done' : 'Task reopened');
        });

        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
          const id = editBtn.dataset.id;
          const taskToEdit = tasks.find(t => t.id === id);
          if (taskToEdit) {
            editingId = id;
            fillFormForEdit(taskToEdit);
          }
        });

        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          const id = deleteBtn.dataset.id;
          tasks = tasks.filter(t => t.id !== id);
          saveTasks();
          render();
          announce('Task deleted');
          if (editingId === id) resetForm(); // if editing this task, reset form
        });

        taskTable.appendChild(row);
      });
    }

    updateProgress();
  }

  // ----- add or update task -----
  function addOrUpdateTask() {
    const name = taskInput.value.trim();
    if (!name) {
      alert('Please enter a task name');
      return;
    }

    const taskData = {
      name: name,
      start: startTime.value,
      end: endTime.value,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false
    };

    if (editingId !== null) {
      // Update existing task
      const index = tasks.findIndex(t => t.id === editingId);
      if (index !== -1) {
        taskData.completed = tasks[index].completed; // preserve completion status
        taskData.id = editingId; // keep same id
        tasks[index] = taskData;
        announce('Task updated');
      }
    } else {
      // Add new task with unique id
      taskData.id = generateId();
      tasks.push(taskData);
      announce('Task added');
    }

    saveTasks();
    resetForm();
    render();
    taskInput.focus();
  }

  // ----- event listeners -----
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

  // hide cancel button initially
  cancelBtn.style.display = 'none';
})();