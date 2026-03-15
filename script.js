const taskList = document.getElementById("taskList")
const addBtn = document.getElementById("addBtn")

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


// DELETE
div.querySelector(".delete").onclick=()=>{

tasks.splice(index,1)

save()

render()

}


// EDIT
div.querySelector(".edit").onclick=()=>{

const newText=prompt("Edit task",task.name)

if(newText){

task.name=newText

save()

render()

}

}


// STATUS CHANGE
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

const name=prompt("Task name")

if(!name) return

const priority=prompt("Priority (High, Medium, Low)","High")

tasks.push({

name,
priority,
status:"To Do"

})

save()

render()

}

render()