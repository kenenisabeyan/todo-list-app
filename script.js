const taskInput = document.getElementById("taskInput")
const startTime = document.getElementById("startTime")
const endTime = document.getElementById("endTime")
const categorySelect = document.getElementById("categorySelect")
const prioritySelect = document.getElementById("prioritySelect")
const addTaskBtn = document.getElementById("addTaskBtn")
const taskTable = document.getElementById("taskTable")
const searchInput = document.getElementById("searchInput")

const progressFill = document.getElementById("progressFill")
const progressText = document.getElementById("progressText")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function updateProgress(){

const done = tasks.filter(t=>t.completed).length

const percent = tasks.length === 0 ? 0 :
Math.round((done/tasks.length)*100)

progressText.textContent = percent + "%"
progressFill.style.width = percent + "%"

}

function render(){

taskTable.innerHTML=""

let search = searchInput.value.toLowerCase()

tasks
.filter(t=>t.name.toLowerCase().includes(search))
.forEach((task,index)=>{

const row=document.createElement("tr")
row.setAttribute("draggable","true")

if(task.completed) row.classList.add("completed")

row.innerHTML=`

<td>${index+1}</td>

<td>${task.name}</td>

<td>${task.start} - ${task.end}</td>

<td>${task.category}</td>

<td>
<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>
</td>

<td>
<input type="checkbox" ${task.completed?"checked":""}>
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

row.querySelector("input").onclick=(e)=>{

task.completed = e.target.checked

save()
render()

}

row.addEventListener("dragstart",()=>{
row.classList.add("dragging")
})

row.addEventListener("dragend",()=>{
row.classList.remove("dragging")
})

})

updateProgress()

}

taskTable.addEventListener("dragover",e=>{

e.preventDefault()

const dragging=document.querySelector(".dragging")

const rows=[...taskTable.querySelectorAll("tr:not(.dragging)")]

const next=rows.find(row=>{

return e.clientY <= row.offsetTop + row.offsetHeight/2

})

taskTable.insertBefore(dragging,next)

})

addTaskBtn.onclick=()=>{

const name = taskInput.value.trim()

if(name==="") return

tasks.push({

name:name,
start:startTime.value,
end:endTime.value,
category:categorySelect.value,
priority:prioritySelect.value,
completed:false

})

taskInput.value=""

save()

render()

}

searchInput.oninput=render

document.getElementById("darkModeBtn").onclick=()=>{

document.body.classList.toggle("dark")

}

render()