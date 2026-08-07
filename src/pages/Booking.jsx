import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"


function Booking(){


const [availability,setAvailability] = useState([])

const [selectedDate,setSelectedDate] = useState("")

const [selectedSlot,setSelectedSlot] = useState(null)

const [showServices,setShowServices] = useState(false)



const [form,setForm] = useState({

name:"",
phone:"",
email:"",
service:""

})




const services = [

{
name:"Coupe",
price:"15€",
description:"Coupe homme personnalisée"
},

{
name:"Coupe + barbe",
price:"20€",
description:"Coupe complète avec taille de barbe"
},

{
name:"Coupe Transformation",
price:"20€",
description:"+ de 2 mois de pousse"
},

]





async function loadAvailability(){


const {

data,

error

}

=
await supabase
.from("availability")
.select("*")
.eq(
"active",
true
)



if(error){

console.log(error)

return

}



setAvailability(
data || []
)


}






useEffect(()=>{

loadAvailability()

},[])







const availableSlots = availability.filter(slot =>

slot.date === selectedDate

)






async function createAppointment(e){


e.preventDefault()



if(!selectedSlot){

return

}




const {

error:appointmentError

}

=
await supabase
.from("appointments")
.insert({

name:form.name,

phone:form.phone,

email:form.email,

service:form.service,

date:selectedSlot.date,

time:selectedSlot.time,

status:"en attente"

})



if(appointmentError){

console.log(appointmentError)

return

}





const {

error:availabilityError

}

=
await supabase
.from("availability")
.update({

active:false

})
.eq(
"id",
selectedSlot.id
)



if(availabilityError){

console.log(availabilityError)

return

}





await loadAvailability()

alert(
"Votre rendez-vous est enregistré"
)



setSelectedSlot(null)


setSelectedDate("")


setForm({

name:"",
phone:"",
email:"",
service:""

})


}






return (

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
text-4xl
md:text-5xl
font-serif
text-center
mb-12
">

Prendre rendez-vous

</h1>






<div className="
bg-white
rounded-[2.5rem]
shadow-xl
p-8
mb-10
">


<h2 className="
text-2xl
font-serif
mb-5
">

Choisir une date

</h2>



<input

type="date"

value={selectedDate}

onChange={(e)=>{


setSelectedDate(
e.target.value
)


setSelectedSlot(null)


}}

className="
w-full
border
p-5
rounded-2xl
focus:outline-none
focus:border-black
transition
duration-300
"

/>


</div>







{
selectedDate && (


<div className="
bg-white
rounded-[2.5rem]
shadow-xl
p-8
mb-10
dropdown-animation
">


<h2 className="
text-2xl
font-serif
mb-6
">

Créneaux disponibles

</h2>






{

availableSlots.length > 0 ?



<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{


availableSlots.map((slot,index)=>(


<button

key={slot.id}

onClick={()=>setSelectedSlot(slot)}

style={{

animationDelay:
`${index * 70}ms`

}}

className={`
p-5
rounded-2xl
border
font-medium
transition-all
duration-300
ease-out
animate-service


${
selectedSlot?.id === slot.id

?

"bg-black text-white border-black scale-110 shadow-xl"

:

"bg-white hover:border-black hover:scale-105"

}

`}

>


{slot.time}


</button>


))


}


</div>



:


<p className="
text-gray-400
">

Aucun créneau disponible pour cette date.

</p>


}



</div>


)

}{
selectedSlot && (


<div className="
bg-white
rounded-[2.5rem]
shadow-xl
p-8
max-w-md
mx-auto
">


<form

onSubmit={createAppointment}

className="
space-y-5
"


>



<h2 className="
text-3xl
font-serif
">

Vos informations

</h2>





<div className="
bg-[#FAFAF8]
rounded-2xl
p-5
text-gray-600
">


<p>

Date :
{selectedSlot.date}

</p>


<p>

Heure :
{selectedSlot.time}

</p>


</div>







<input

className="
w-full
border
p-4
rounded-2xl
focus:outline-none
focus:border-black
transition
"

placeholder="Nom"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>






<input

className="
w-full
border
p-4
rounded-2xl
focus:outline-none
focus:border-black
transition
"

placeholder="Téléphone"

value={form.phone}

onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

/>







<input

className="
w-full
border
p-4
rounded-2xl
focus:outline-none
focus:border-black
transition
"

placeholder="Email"

value={form.email}

onChange={(e)=>

setForm({

...form,

email:e.target.value

})

}

/>








<div className="relative">


<button

type="button"

onClick={()=>setShowServices(!showServices)}

className="
w-full
border
p-5
rounded-2xl
text-left
bg-white
transition-all
duration-300
hover:border-black
hover:shadow-lg
"

>


{

form.service

?

form.service

:

"Choisir une prestation"

}


</button>







{

showServices && (


<div className="
absolute
z-50
mt-4
w-full
bg-white
rounded-[2rem]
shadow-2xl
border
overflow-hidden
dropdown-animation
">


{


services.map((service,index)=>(


<button

key={service.name}

type="button"

style={{

animationDelay:
`${index*80}ms`

}}

onClick={()=>{


setForm({

...form,

service:
`${service.name} - ${service.price}`

})


setShowServices(false)


}}


className="
w-full
p-5
text-left
border-b
last:border-none
transition-all
duration-300
hover:bg-[#FAFAF8]
hover:px-7
animate-service
"

>



<div className="
flex
justify-between
items-center
">


<p className="
font-serif
text-lg
">

{service.name}

</p>


<p className="
font-bold
">

{service.price}

</p>


</div>




<p className="
text-sm
text-gray-400
mt-2
">

{service.description}

</p>



</button>


))


}



</div>


)


}


</div>







<button

type="submit"

className="
w-full
bg-black
text-white
py-5
rounded-full
uppercase
tracking-[0.25em]
text-sm
transition-all
duration-300
hover:bg-gray-800
hover:scale-105
"

>

Confirmer le rendez-vous

</button>







<button

type="button"

onClick={()=>setSelectedSlot(null)}

className="
w-full
border
py-5
rounded-full
transition
duration-300
hover:border-black
"

>

Changer d'horaire

</button>





</form>


</div>


)

}



</div>


</div>


)

}


export default Booking