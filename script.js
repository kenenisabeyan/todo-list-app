const taskInput = document.getElementById("taskInput")
const prioritySelect = document.getElementById("prioritySelect")
const statusSelect = document.getElementById("statusSelect")
const addTaskBtn = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function saveTasks(){

localStorage.setItem("tasks", JSON.stringify(tasks))

}

function renderTasks(){

taskList.innerHTML = ""

tasks.forEach((task,index)=>{

let circleClass=""

if(task.status==="Done") circleClass="done"
if(task.status==="In Progress") circleClass="progress"

const taskDiv = document.createElement("div")

taskDiv.className="task"

taskDiv.innerHTML = `

<div class="column">

<div class="label">Task</div>
<div class="task-name">${task.name}</div>

</div>


<div class="column">

<div class="label">Priority</div>
<div class="priority ${task.priority.toLowerCase()}">
${task.priority}
</div>

</div>


<div class="column">

<div class="label">Status</div>
<div class="status">${task.status}</div>

</div>


<div class="circle ${circleClass}"></div>

<i class="fa-solid fa-pen edit"></i>

<i class="fa-solid fa-trash delete"></i>

`

taskList.appendChild(taskDiv)



// delete

taskDiv.querySelector(".delete").onclick=()=>{

tasks.splice(index,1)

saveTasks()

renderTasks()

}



// edit

taskDiv.querySelector(".edit").onclick=()=>{

const newTask = prompt("Edit task",task.name)

if(newTask){

task.name=newTask

saveTasks()

renderTasks()

}

}



// change status

taskDiv.querySelector(".circle").onclick=()=>{

if(task.status==="To Do"){

task.status="In Progress"

}

else if(task.status==="In Progress"){

task.status="Done"

}

else{

task.status="To Do"

}

saveTasks()

renderTasks()

}

})

}

addTaskBtn.onclick=()=>{

const name = taskInput.value.trim()

if(name==="") return

tasks.push({

name:name,

priority:prioritySelect.value,

status:statusSelect.value

})

taskInput.value=""

saveTasks()

renderTasks()

}

renderTasks()