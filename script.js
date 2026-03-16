const table=document.getElementById("taskTable")

const search=document.getElementById("search")

const filterPriority=document.getElementById("filterPriority")
const filterCategory=document.getElementById("filterCategory")
const filterStatus=document.getElementById("filterStatus")

let tasks=JSON.parse(localStorage.getItem("tasks"))||[]

const save=()=>localStorage.setItem("tasks",JSON.stringify(tasks))


function dashboard(){

const total=tasks.filter(t=>!t.deleted).length

const done=tasks.filter(t=>t.completed && !t.deleted).length

document.getElementById("total").textContent=total
document.getElementById("done").textContent=done

const percent=total?Math.round(done/total*100):0

document.getElementById("progress").textContent=percent+"%"

}


function render(){

table.innerHTML=""

const filtered=tasks.filter(t=>{

return(

!t.deleted &&

(!filterPriority.value || t.priority===filterPriority.value) &&

(!filterCategory.value || t.category===filterCategory.value) &&

(!filterStatus.value || String(t.completed)===filterStatus.value) &&

t.name.toLowerCase().includes(search.value.toLowerCase())

)

})

filtered.forEach((task,i)=>{

const tr=document.createElement("tr")

if(task.completed) tr.classList.add("completed")

tr.innerHTML=`

<td>${i+1}</td>

<td>${task.name}</td>

<td>${task.due||""}</td>

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

dashboard()

}


document.getElementById("addBtn").onclick=()=>{

const name=document.getElementById("taskName").value.trim()

if(!name) return

tasks.push({

id:Date.now(),

name,

due:document.getElementById("taskDate").value,

category:document.getElementById("taskCategory").value,

priority:document.getElementById("taskPriority").value,

completed:false,

deleted:false

})

save()

render()

}


table.onclick=e=>{

const id=e.target.dataset.check || 
e.target.dataset.edit || 
e.target.dataset.del

if(!id) return

const task=tasks.find(t=>t.id==id)

if(e.target.dataset.check){

task.completed=!task.completed

}

if(e.target.dataset.edit){

const newName=prompt("Edit task",task.name)

if(newName) task.name=newName

}

if(e.target.dataset.del){

task.deleted=true

}

save()

render()

}


search.oninput=render
filterPriority.onchange=render
filterCategory.onchange=render
filterStatus.onchange=render


document.getElementById("darkBtn").onclick=()=>{

document.body.classList.toggle("dark")

}


setInterval(()=>{

const now=new Date()

tasks.forEach(t=>{

if(t.due && new Date(t.due)<now && !t.completed && !t.alerted){

alert("Task overdue: "+t.name)

t.alerted=true

}

})

save()

},60000)


render()