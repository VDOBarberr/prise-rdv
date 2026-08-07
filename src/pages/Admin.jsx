import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"


function Admin(){


const [currentDate,setCurrentDate] =
useState(new Date())


const [availability,setAvailability] =
useState([])


const [appointments,setAppointments] =
useState([])


const [editingAppointment,setEditingAppointment] =
useState(null)


const [selectedDay,setSelectedDay] =
useState(null)



const daysOrder = [
"lundi",
"mardi",
"mercredi",
"jeudi",
"vendredi",
"samedi",
"dimanche"
]


const times = [
"09h00",
"10h00",
"11h00",
"12h00",
"13h00",
"14h00",
"15h00",
"16h00",
"17h00",
"18h00"
]


// CHARGEMENT DES DONNEES

async function loadData(){


const {
data:availabilityData,
error:availabilityError

}
=
await supabase
.from("availability")
.select("*")



if(availabilityError){

console.log(
availabilityError
)

return

}




const {
data:appointmentsData,
error:appointmentsError

}
=
await supabase
.from("appointments")
.select("*")



if(appointmentsError){

console.log(
appointmentsError
)

return

}




setAvailability(
availabilityData || []
)


setAppointments(
appointmentsData || []
)


}





useEffect(()=>{

loadData()

},[])





// DATE DU LUNDI

function getMonday(date){

const result =
new Date(date)


const day =
result.getDay()



const diff =
day === 0
?
-6
:
1-day



result.setDate(
result.getDate()+diff
)


return result

}





function formatDate(date){

const year =
date.getFullYear()


const month =
String(
date.getMonth()+1
)
.padStart(2,"0")


const day =
String(
date.getDate()
)
.padStart(2,"0")



return `${year}-${month}-${day}`

}// CHANGER DE SEMAINE

function changeWeek(value){

const date =
new Date(currentDate)


date.setDate(
date.getDate()+value*7
)


setCurrentDate(date)

}




// GENERER LES JOURS DE LA SEMAINE

function getWeekDays(){

const monday =
getMonday(currentDate)



return daysOrder.map((day,index)=>{


const date =
new Date(monday)


date.setDate(
monday.getDate()+index
)


return {

name:day,

date:formatDate(date)

}


})


}





// SELECTIONNER UN JOUR

function selectDay(day){

setSelectedDay(day)

}




// VERIFIER SI UN CRENEAU EXISTE

function isAvailable(date,time){


return availability.some(item=>

item.date === date
&&
item.time === time
&&
item.active === true

)

}





// AJOUT DISPONIBILITE

async function addAvailability(date,time){


if(isAvailable(date,time)){

return

}



const day =
new Date(date)
.toLocaleDateString(
"fr-FR",
{
weekday:"long"
}
)
.toLowerCase()



const {
error

}
=
await supabase
.from("availability")
.insert({

date:date,

day:day,

time:time,

active:true

})



if(error){

console.log(error)

return

}



loadData()

}





// SUPPRIMER DISPONIBILITE

async function removeAvailability(date,time){


const {
error

}
=
await supabase
.from("availability")
.delete()
.eq(
"date",
date
)
.eq(
"time",
time
)



if(error){

console.log(error)

return

}



loadData()

}





// RENDEZ VOUS

function getAppointment(date,time){


return appointments.find(item=>{


const appointmentDate =
item.date?.split("T")[0]


return (

appointmentDate === date

&&

item.time === time

)


})


}return (

<div className="
min-h-screen
bg-[#FAFAF8]
p-6
md:p-10
">


<div className="
max-w-5xl
mx-auto
">


<h1 className="
text-5xl
font-serif
mb-10
">

Mon planning

</h1>



<div className="
flex
justify-between
mb-8
">


<button

onClick={()=>changeWeek(-1)}

className="
bg-black
text-white
px-6
py-3
rounded-full
"

>

Semaine précédente

</button>



<button

onClick={()=>changeWeek(1)}

className="
bg-black
text-white
px-6
py-3
rounded-full
"

>

Semaine suivante

</button>


</div>






<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
mb-10
">


{
getWeekDays().map(day=>(


<button

key={day.date}

onClick={()=>selectDay(day)}

className={`

p-5
rounded-3xl
border
transition

${
selectedDay?.date === day.date

?

"bg-black text-white"

:

"bg-white"

}

`}

>


<p className="
capitalize
font-serif
text-xl
">

{day.name}

</p>


<p className="
text-sm
">

{day.date}

</p>



</button>


))

}


</div>








{
selectedDay && (


<div className="
bg-white
rounded-[3rem]
p-8
shadow-xl
">


<h2 className="
text-3xl
font-serif
mb-8
capitalize
">

Disponibilités du {selectedDay.name}

</h2>





<div className="
grid
grid-cols-2
md:grid-cols-5
gap-4
">


{
times.map(time=>{


const active =
isAvailable(
selectedDay.date,
time
)



return (


<button

key={time}

onClick={()=>


active

?

removeAvailability(
selectedDay.date,
time
)

:

addAvailability(
selectedDay.date,
time
)


}

className={`

p-5
rounded-3xl
font-bold
transition

${
active

?

"bg-green-500 text-white"

:

"bg-gray-100"

}

`}

>


{time}


<br/>


<span className="
text-xs
">

{
active
?
"Ouvert"
:
"Fermé"
}

</span>



</button>


)


})

}


</div>



</div>


)

}



</div>


</div>


)

}


export default Admin