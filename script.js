const taskInput=document.getElementById("taskInput")
const dueDate=document.getElementById("dueDate")
const categorySelect=document.getElementById("categorySelect")
const prioritySelect=document.getElementById("prioritySelect")

const searchInput=document.getElementById("searchInput")

const filterPriority=document.getElementById("filterPriority")
const filterCategory=document.getElementById("filterCategory")
const filterDone=document.getElementById("filterDone")

const taskTable=document.getElementById("taskTable")

let tasks=JSON.parse(localStorage.getItem("tasks"))||[]

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function analytics(){

const total=tasks.length
const done=tasks.filter(t=>t.completed).length

document.getElementById("totalTasks").textContent=total
document.getElementById("doneTasks").textContent=done

const percent=total===0?0:Math.round(done/total*100)

document.getElementById("progressPercent").textContent=percent+"%"
}

function render(){

taskTable.innerHTML=""

let filtered=tasks.filter(t=>{

return(
(!filterPriority.value||t.priority===filterPriority.value)&&
(!filterCategory.value||t.category===filterCategory.value)&&
(!filterDone.value||String(t.completed)===filterDone.value)&&
t.name.toLowerCase().includes(searchInput.value.toLowerCase())&&
!t.deleted
)

})

filtered.forEach((task,index)=>{

const row=document.createElement("tr")

if(task.completed) row.classList.add("completed")

row.innerHTML=`

<td>${index+1}</td>

<td>${task.name}</td>

<td>${task.due}</td>

<td>${task.category}</td>

<td class="priority-${task.priority.toLowerCase()}">
${task.priority}
</td>

<td>
<input type="checkbox" ${task.completed?"checked":""}>
</td>

<td class="edit">
<i class="fa-solid fa-pen"></i>
</td>

<td class="delete">
<i class="fa-solid fa-xmark"></i>
</td>

`

taskTable.appendChild(row)

row.querySelector("input").onclick=(e)=>{
task.completed=e.target.checked
save()
render()
}

row.querySelector(".delete").onclick=()=>{
task.deleted=true
save()
render()
}

row.querySelector(".edit").onclick=()=>{
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
completed:false,
deleted:false

})

save()
render()

}

searchInput.oninput=render
filterPriority.onchange=render
filterCategory.onchange=render
filterDone.onchange=render

document.getElementById("darkModeBtn").onclick=()=>{
document.body.classList.toggle("dark")
}

setInterval(()=>{

tasks.forEach(task=>{

if(task.due && new Date(task.due)<new Date() && !task.completed){

alert("Task overdue: "+task.name)

}

})

},60000)

render()