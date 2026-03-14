const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", () => {

    const taskName = prompt("Enter task name:");
    const priority = prompt("Priority: high / medium / low");
    const status = prompt("Status: To Do / In Progress / Done");

    if(!taskName) return;

    const task = document.createElement("div");
    task.className = "task";

    task.innerHTML = `
        <div class="task-info">
            <div class="task-title">${taskName}</div>
            <div>
                <span class="priority ${priority.toLowerCase()}">
                    ${priority}
                </span>
                <span class="status">${status}</span>
            </div>
        </div>

        <div class="actions">
            <input type="checkbox">
            <button class="edit">✏️</button>
            <button class="delete">🗑️</button>
        </div>
    `;

    taskList.appendChild(task);

    // delete
    task.querySelector(".delete").onclick = () =>{
        task.remove();
    }

    // edit
    task.querySelector(".edit").onclick = () =>{
        const newTask = prompt("Edit task", taskName);
        if(newTask) task.querySelector(".task-title").textContent = newTask;
    }

});