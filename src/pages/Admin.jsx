import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function Admin() {


const [currentDate,setCurrentDate] = useState(new Date())

const [availability,setAvailability] = useState([])

const [appointments,setAppointments] = useState([])

const [editingAppointment,setEditingAppointment] = useState(null)



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
"14h00",
"15h00"
]





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
"Erreur disponibilité :",
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
"Erreur rendez-vous :",
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





function getMonday(date){


const result = new Date(date)


const day = result.getDay()



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
String(date.getMonth()+1)
.padStart(2,"0")


const day =
String(date.getDate())
.padStart(2,"0")



return `${year}-${month}-${day}`

}





function getWeekDays(){


const monday =
getMonday(currentDate)



const openedDays = [

...new Set(

availability.map(
item=>item.day.toLowerCase()
)

)

]



return daysOrder

.filter(day =>
openedDays.includes(day)
)

.map(day=>{


const date =
new Date(monday)



const index =
daysOrder.indexOf(day)



date.setDate(
monday.getDate()+index
)



return {

name:day,

date:formatDate(date)

}


})


}





function getAppointment(date,time){


return appointments.find(

appointment=>{


const appointmentDate =
appointment.date?.split("T")[0]


return (

appointmentDate === date

&&

appointment.time === time

)


}

)


}async function deleteAppointment(id){


if(
!window.confirm(
"Supprimer ce rendez-vous ?"
)

){

return

}



const {error}=

await supabase

.from("appointments")

.delete()

.eq("id",id)



if(error){

console.log(error)

return

}



loadData()


}





function openEdit(appointment){


setEditingAppointment({

...appointment

})


}






async function updateAppointment(e){


e.preventDefault()



const {error}=

await supabase

.from("appointments")

.update({

name:editingAppointment.name,

phone:editingAppointment.phone,

email:editingAppointment.email,

service:editingAppointment.service,

date:editingAppointment.date,

time:editingAppointment.time,

status:editingAppointment.status

})

.eq(
"id",
editingAppointment.id
)




if(error){

console.log(error)

return

}



setEditingAppointment(null)

loadData()


}







function changeWeek(value){


const date =
new Date(currentDate)



date.setDate(
date.getDate()+value*7
)



setCurrentDate(date)


}





const weekDays =
getWeekDays()





return (


<div className="
min-h-screen
bg-[#FAFAF8]
text-black
p-6
md:p-10
">





{/* HEADER */}



<div className="
max-w-7xl
mx-auto
mb-10
">


<p className="
uppercase
tracking-[0.4em]
text-xs
text-gray-500
mb-4
">

Administration

</p>



<h1 className="
text-4xl
md:text-6xl
font-serif
tracking-wide
">

Mon planning

</h1>


</div>







{/* NAVIGATION */}



<div className="
max-w-7xl
mx-auto
flex
justify-center
gap-4
mb-10
">



<button

onClick={()=>changeWeek(-1)}

className="
px-8
py-4
rounded-full
bg-black
text-white
hover:bg-gray-800
hover:-translate-y-1
transition
duration-300
shadow-lg
"

>

Semaine précédente

</button>





<button

onClick={()=>changeWeek(1)}

className="
px-8
py-4
rounded-full
bg-black
text-white
hover:bg-gray-800
hover:-translate-y-1
transition
duration-300
shadow-lg
"

>

Semaine suivante

</button>



</div>







{/* PLANNING */}



<div className="
max-w-7xl
mx-auto
bg-white
rounded-[2.5rem]
shadow-xl
overflow-x-auto
border
border-gray-100
">



<div className="
min-w-[950px]
">





<div

className="
grid
border-b
border-gray-200
"

style={{

gridTemplateColumns:
`120px repeat(${weekDays.length},1fr)`

}}

>



<div className="
p-5
font-serif
">

Heure

</div>




{weekDays.map(day=>(


<div

key={day.date}

className="
p-5
text-center
capitalize
"

>


<p className="
font-serif
text-lg
">

{day.name}

</p>



<p className="
text-xs
text-gray-400
mt-1
">

{day.date}

</p>



</div>


))}


</div>{times.map(time=>(


<div

key={time}

className="
grid
border-b
border-gray-100
"

style={{

gridTemplateColumns:
`120px repeat(${weekDays.length},1fr)`

}}

>



<div className="
p-5
text-sm
text-gray-500
">

{time}

</div>





{weekDays.map(day=>{


const appointment =
getAppointment(
day.date,
time
)



return (


<div

key={day.date+time}

className="
border-l
border-gray-100
p-2
min-h-[110px]
flex
items-center
justify-center
"

>



{appointment ? (



<div className="
w-full
bg-black
text-white
rounded-2xl
p-3
shadow-md
">



<p className="
uppercase
tracking-[0.15em]
text-[10px]
text-gray-400
mb-2
">

{appointment.service}

</p>




<p className="
font-serif
text-base
">

{appointment.name}

</p>




<p className="
text-xs
text-gray-400
mt-1
">

{appointment.phone}

</p>





<div className="
flex
gap-2
mt-3
">



<button

onClick={()=>openEdit(appointment)}

className="
flex-1
rounded-full
bg-white
text-black
py-1.5
text-xs
hover:bg-gray-200
transition
"

>

Modifier

</button>





<button

onClick={()=>deleteAppointment(appointment.id)}

className="
flex-1
rounded-full
border
border-white/30
py-1.5
text-xs
hover:bg-white
hover:text-black
transition
"

>

Supprimer

</button>



</div>



</div>




) : (


<span className="
text-gray-300
text-xs
uppercase
tracking-widest
">

Libre

</span>


)}



</div>


)


})}



</div>


))}



</div>

</div>







{/* MODIFICATION */}



{editingAppointment && (


<div className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
p-6
z-50
">



<form

onSubmit={updateAppointment}

className="
bg-white
rounded-[3rem]
p-8
w-full
max-w-md
shadow-2xl
space-y-5
"

>



<h2 className="
text-3xl
font-serif
">

Modifier rendez-vous

</h2>





<input

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

value={editingAppointment.name || ""}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

name:e.target.value

})

}

/>





<input

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

value={editingAppointment.phone || ""}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

phone:e.target.value

})

}

/>





<input

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

value={editingAppointment.email || ""}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

email:e.target.value

})

}

/>





<input

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

placeholder="Prestation"

value={editingAppointment.service || ""}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

service:e.target.value

})

}

/>





<input

type="date"

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

value={
editingAppointment.date?.split("T")[0] || ""
}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

date:e.target.value

})

}

/>





<select

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
"

value={editingAppointment.time || ""}

onChange={(e)=>

setEditingAppointment({

...editingAppointment,

time:e.target.value

})

}

>


{times.map(time=>(

<option
key={time}
value={time}
>

{time}

</option>

))}


</select>





<button

type="submit"

className="
w-full
py-5
rounded-full
bg-black
text-white
uppercase
tracking-[0.25em]
text-sm
hover:bg-gray-800
transition
"

>

Enregistrer

</button>





<button

type="button"

onClick={()=>setEditingAppointment(null)}

className="
w-full
py-5
rounded-full
bg-[#FAFAF8]
border
border-gray-200
hover:border-black
transition
"

>

Annuler

</button>




</form>


</div>


)}



</div>


)


}


export default Admin