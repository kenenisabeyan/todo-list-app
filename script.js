const taskInput = document.getElementById("taskInput")
const dueDate = document.getElementById("dueDate")
const categorySelect = document.getElementById("categorySelect")
const prioritySelect = document.getElementById("prioritySelect")

const filterPriority = document.getElementById("filterPriority")
const filterCategory = document.getElementById("filterCategory")
const filterStatus = document.getElementById("filterStatus")

const searchInput = document.getElementById("searchInput")

const todoList = document.getElementById("todoList")
const progressList = document.getElementById("progressList")
const doneList = document.getElementById("doneList")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function analytics(){

const total = tasks.length
const done = tasks.filter(t=>t.status==="Done").length

document.getElementById("totalTasks").textContent = total
document.getElementById("doneTasks").textContent = done

const percent = total===0 ? 0 : Math.round(done/total*100)

document.getElementById("progressPercent").textContent = percent+"%"

}

function render(){

todoList.innerHTML=""
progressList.innerHTML=""
doneList.innerHTML=""

let filtered = tasks.filter(t=>{

return (
(!filterPriority.value || t.priority===filterPriority.value) &&
(!filterCategory.value || t.category===filterCategory.value) &&
(!filterStatus.value || t.status===filterStatus.value) &&
t.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
!t.deleted
)

})

filtered.forEach((task,index)=>{

const card=document.createElement("div")
card.className="task"
card.draggable=true

card.innerHTML=`

<strong>${task.name}</strong>

<div class="meta">

<span>${task.category}</span>

<span class="priority-${task.priority.toLowerCase()}">
${task.priority}
</span>

</div>

<div class="meta">

<span>${task.due}</span>

<span>${task.status}</span>

</div>

<div class="actions">

<i class="fa fa-check"></i>

<i class="fa fa-pen"></i>

<i class="fa fa-xmark"></i>

</div>

`

const container =
task.status==="To Do"?todoList:
task.status==="In Progress"?progressList:
doneList

container.appendChild(card)

card.querySelector(".fa-check").onclick=()=>{
task.status="Done"
save()
render()
}

card.querySelector(".fa-xmark").onclick=()=>{
task.deleted=true
save()
render()
}

card.querySelector(".fa-pen").onclick=()=>{
const newName=prompt("Edit task",task.name)
if(newName){
task.name=newName
save()
render()
}
}

})

analytics()

}

document.getElementById("addTaskBtn").onclick=()=>{

const name=taskInput.value.trim()

if(!name) return

tasks.push({

name,
due:dueDate.value,
category:categorySelect.value,
priority:prioritySelect.value,
status:"To Do",
deleted:false

})

save()
render()

}

searchInput.oninput=render
filterPriority.onchange=render
filterCategory.onchange=render
filterStatus.onchange=render

document.getElementById("darkModeBtn").onclick=()=>{
document.body.classList.toggle("dark")
}

setInterval(()=>{

tasks.forEach(task=>{

if(task.due && new Date(task.due) < new Date() && task.status!=="Done"){

alert("Task overdue: "+task.name)

}

})

},60000)

render()