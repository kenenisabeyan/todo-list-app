const taskInput = document.getElementById("taskInput")
const prioritySelect = document.getElementById("prioritySelect")
const statusSelect = document.getElementById("statusSelect")
const addTaskBtn = document.getElementById("addTaskBtn")
const taskTable = document.getElementById("taskTable")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function render(){

taskTable.innerHTML=""

tasks.forEach((task,index)=>{

let circleClass=""

if(task.status==="Done") circleClass="done"
if(task.status==="In Progress") circleClass="progress"

const row=document.createElement("tr")

row.innerHTML=`

<td>${index+1}</td>
<td>${task.name}</td>
<td class="${task.priority.toLowerCase()}">${task.priority}</td>
<td><span class="status">${task.status}</span></td>
<td><span class="circle ${circleClass}"></span></td>
<td class="edit">✏</td>
<td class="delete">🗑</td>

`

taskTable.appendChild(row)

row.querySelector(".delete").onclick=()=>{

tasks.splice(index,1)
save()
render()

}

row.querySelector(".edit").onclick=()=>{

const newTask=prompt("Edit task",task.name)

if(newTask){
task.name=newTask
save()
render()
}

}

row.querySelector(".circle").onclick=()=>{

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

addTaskBtn.onclick=()=>{

const name=taskInput.value.trim()

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