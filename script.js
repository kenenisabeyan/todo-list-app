const taskInput = document.getElementById("taskInput")
const prioritySelect = document.getElementById("prioritySelect")
const statusSelect = document.getElementById("statusSelect")
const addBtn = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList")
const filters = document.querySelectorAll(".filter")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let currentFilter = "All"


function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks))
}


function renderTasks(){

taskList.innerHTML=""

tasks
.filter(task=>{
if(currentFilter==="All") return true
return task.status===currentFilter
})
.forEach((task,index)=>{

const div = document.createElement("div")
div.className="task"
div.draggable=true

div.innerHTML=`

<div class="task-left">

<div class="task-title">${task.text}</div>

<div>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

<span class="status">${task.status}</span>

</div>

</div>

<div class="task-right">

<div class="checkbox ${task.done ? "completed" : ""}"></div>

<i class="fa-solid fa-pen edit"></i>

<i class="fa-solid fa-trash delete"></i>

</div>

`

taskList.appendChild(div)


div.querySelector(".delete").onclick=()=>{
tasks.splice(index,1)
saveTasks()
renderTasks()
}


div.querySelector(".checkbox").onclick=()=>{
tasks[index].done=!tasks[index].done
saveTasks()
renderTasks()
}


div.querySelector(".edit").onclick=()=>{
const newText=prompt("Edit task",task.text)
if(newText){
tasks[index].text=newText
saveTasks()
renderTasks()
}
}


div.addEventListener("dragstart",()=>{
div.classList.add("dragging")
})


div.addEventListener("dragend",()=>{
div.classList.remove("dragging")
})

})


}



taskList.addEventListener("dragover",(e)=>{

e.preventDefault()

const dragging=document.querySelector(".dragging")

const siblings=[...taskList.querySelectorAll(".task:not(.dragging)")]

let nextSibling=siblings.find(sibling=>{
return e.clientY <= sibling.offsetTop + sibling.offsetHeight/2
})

taskList.insertBefore(dragging,nextSibling)

})



addBtn.onclick=()=>{

const text=taskInput.value.trim()

if(text==="") return

tasks.push({
text,
priority:prioritySelect.value,
status:statusSelect.value,
done:false
})

taskInput.value=""

saveTasks()

renderTasks()

}



filters.forEach(btn=>{

btn.onclick=()=>{

document.querySelector(".active").classList.remove("active")

btn.classList.add("active")

currentFilter=btn.dataset.filter

renderTasks()

}

})



renderTasks()