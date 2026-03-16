const table = document.getElementById("taskTable")

const tasks = JSON.parse(localStorage.getItem("tasks")) || []

const save = () => localStorage.setItem("tasks", JSON.stringify(tasks))


function updateStats(){

const total = tasks.filter(t=>!t.deleted).length
const done = tasks.filter(t=>t.completed && !t.deleted).length

document.getElementById("totalTasks").textContent = total
document.getElementById("doneTasks").textContent = done

const percent = total ? Math.round(done/total*100) : 0

document.getElementById("progress").textContent = percent + "%"

}


function render(){

table.innerHTML=""

const search = document.getElementById("searchInput").value.toLowerCase()
const pFilter = document.getElementById("priorityFilter").value
const cFilter = document.getElementById("categoryFilter").value
const sFilter = document.getElementById("statusFilter").value


tasks
.filter(task=>{

return(
!task.deleted &&
(!pFilter || task.priority===pFilter) &&
(!cFilter || task.category===cFilter) &&
(!sFilter || String(task.completed)===sFilter) &&
task.name.toLowerCase().includes(search)
)

})

.forEach((task,i)=>{

const tr = document.createElement("tr")

if(task.completed) tr.classList.add("completed")

tr.innerHTML = `

<td>${i+1}</td>

<td>${task.name}</td>

<td>${task.due || "-"}</td>

<td>${task.category}</td>

<td class="priority-${task.priority.toLowerCase()}">
${task.priority}
</td>

<td>
<input type="checkbox" data-check="${task.id}" ${task.completed?"checked":""}>
</td>

<td class="edit" data-edit="${task.id}">
<i class="fa-solid fa-pen"></i>
</td>

<td class="delete" data-del="${task.id}">
<i class="fa-solid fa-xmark"></i>
</td>

`

table.appendChild(tr)

})

updateStats()

}


document.getElementById("addTask").onclick = () => {

const name = document.getElementById("taskName").value.trim()

if(!name) return

tasks.push({

id:Date.now(),
name,
due:document.getElementById("taskDue").value,
category:document.getElementById("taskCategory").value,
priority:document.getElementById("taskPriority").value,
completed:false,
deleted:false

})

document.getElementById("taskName").value=""
document.getElementById("taskDue").value=""

save()
render()

}


table.onclick = (e)=>{

const id = e.target.dataset.check ||
e.target.dataset.edit ||
e.target.dataset.del

if(!id) return

const task = tasks.find(t=>t.id==id)

if(e.target.dataset.check){

task.completed = !task.completed

}

if(e.target.dataset.edit){

const newName = prompt("Edit task",task.name)

if(newName) task.name = newName

}

if(e.target.dataset.del){

task.deleted = true

}

save()
render()

}


document.getElementById("searchInput").oninput = render
document.getElementById("priorityFilter").onchange = render
document.getElementById("categoryFilter").onchange = render
document.getElementById("statusFilter").onchange = render


document.getElementById("darkToggle").onclick = () => {
document.body.classList.toggle("dark")
}


render()