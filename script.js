const taskInput = document.getElementById("taskInput")
const startTime = document.getElementById("startTime")
const endTime = document.getElementById("endTime")
const prioritySelect = document.getElementById("prioritySelect")
const statusSelect = document.getElementById("statusSelect")
const addTaskBtn = document.getElementById("addTaskBtn")
const taskTable = document.getElementById("taskTable")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function updateProgress(){

const done = tasks.filter(t=>t.completed).length

const percent = tasks.length===0 ? 0 :
Math.round((done/tasks.length)*100)

document.getElementById("progressText").textContent = percent+"%"

document.getElementById("progressFill").style.width = percent+"%"

}

function render(){

taskTable.innerHTML=""

tasks.forEach((task,index)=>{

const row=document.createElement("tr")

if(task.completed) row.classList.add("completed")

row.innerHTML = `

<td>${index+1}</td>

<td>${task.name}</td>

<td>${task.start} - ${task.end}</td>

<td>
<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>
</td>

<td>
<span class="status">${task.status}</span>
</td>

<td>
<input type="checkbox" class="check" ${task.completed?"checked":""}>
</td>

<td class="edit">
<i class="fa-solid fa-pen"></i>
</td>

<td class="delete">
<i class="fa-solid fa-trash"></i>
</td>

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

row.querySelector(".check").onclick=(e)=>{

task.completed = e.target.checked

save()
render()

}

})

updateProgress()

}

addTaskBtn.onclick=()=>{

const name = taskInput.value.trim()

if(name==="") return

tasks.push({

name:name,
start:startTime.value,
end:endTime.value,
priority:prioritySelect.value,
status:statusSelect.value,
completed:false

})

taskInput.value=""

save()

render()

}

render()