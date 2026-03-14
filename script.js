const taskList = document.getElementById("taskList")

const tasks = [

{
name:"Go to gym",
priority:"High",
status:"To Do"
},

{
name:"Read a book",
priority:"Low",
status:"Done"
},

{
name:"Go to market",
priority:"Medium",
status:"In Progress"
},

{
name:"Restart Learning Solidworks",
priority:"High",
status:"To Do"
},

{
name:"change slider to scroll",
priority:"High",
status:"Done"
},

{
name:"To publish the article",
priority:"Medium",
status:"In Progress"
}

]

function render(){

taskList.innerHTML=""

tasks.forEach(task=>{

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


<div class="status">
${task.status}
</div>


<div class="task-right">

<div class="circle ${circleClass}"></div>

<i class="fa-regular fa-pen-to-square"></i>

<i class="fa-regular fa-trash-can delete"></i>

</div>

`

taskList.appendChild(div)

})

}

render()