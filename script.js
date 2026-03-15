const taskInput = document.getElementById("taskInput")
const prioritySelect = document.getElementById("prioritySelect")
const statusSelect = document.getElementById("statusSelect")
const addBtn = document.getElementById("addBtn")
const taskList = document.getElementById("taskList")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function render(){

taskList.innerHTML=""

tasks.forEach((task,index)=>{

let circleClass=""

if(task.status==="Done") circleClass="done"
if(task.status==="In Progress") circleClass="progress"

const div=document.createElement("div")

div.className="task"

div.innerHTML=`

<div class="task-left">

<div class="label">Task</div>
<div class="task-name">${task.name}</div>

</div>

<div>

<div class="label">Priority</div>
<div class="priority ${task.priority.toLowerCase()}">
${task.priority}
</div>

</div>

<div class="status">${task.status}</div>

<div class="task-right">

<div class="circle ${circleClass}"></div>

<i class="fa-regular fa-pen-to-square edit"></i>

<i class="fa-regular fa-trash-can delete"></i>

</div>

`

taskList.appendChild(div)


div.querySelector(".delete").onclick=()=>{
tasks.splice(index,1)
save()
render()
}

div.querySelector(".edit").onclick=()=>{
const newName = prompt("Edit task",task.name)

if(newName){
task.name=newName
save()
render()
}
}

div.querySelector(".circle").onclick=()=>{

if(task.status==="To Do"){
task.status="In Progress"
}

else if(task.status==="In Progress"){
task.status="Done"
}

else{
task.status="To Do"
}

save()
render()

}

})

}


addBtn.onclick=()=>{

const name = taskInput.value.trim()

if(name==="") return

tasks.push({

name,
priority:prioritySelect.value,
status:statusSelect.value

})

taskInput.value=""

save()

render()

}

render()