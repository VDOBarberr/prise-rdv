import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"


function Reservation(){


const allTimes = [

"09h00",
"10h00",
"11h00",
"14h00",
"15h00"

]



const [services,setServices] = useState([])

const [selectedService,setSelectedService] = useState(null)

const [selectedDate,setSelectedDate] = useState("")

const [availableTimes,setAvailableTimes] = useState([])

const [selectedTime,setSelectedTime] = useState(null)



const [form,setForm] = useState({

name:"",
phone:"",
email:""

})


const [confirmed,setConfirmed] = useState(false)







async function getServices(){


const {data,error}=await supabase
.from("services")
.select("*")
.eq("active",true)



if(error){

console.log(error)

return

}



setServices(data || [])


}







useEffect(()=>{

getServices()

},[])










async function getAvailableTimes(date){



if(!date){

setAvailableTimes([])

return

}





const {data,error}=await supabase
.from("appointments")
.select("time")
.eq("date",date)





if(error){

console.log(error)

return

}





const bookedTimes =
data.map(
appointment=>appointment.time
)





const freeTimes =
allTimes.filter(
time=>!bookedTimes.includes(time)
)





setAvailableTimes(freeTimes)

setSelectedTime(null)



}








useEffect(()=>{


getAvailableTimes(selectedDate)


},[selectedDate])









function handleChange(e){


setForm({

...form,

[e.target.name]:e.target.value

})


}









async function handleSubmit(e){


e.preventDefault()





const {error}=await supabase
.from("appointments")
.insert([

{

name:form.name,

phone:form.phone,

email:form.email,

date:selectedDate,

time:selectedTime,

service:selectedService.name,

status:"confirmé"

}

])






if(error){

console.log(error)

alert("Erreur lors de la réservation")

return

}





setConfirmed(true)



}return (

<div className="
min-h-screen
bg-[#FAFAF8]
px-5
py-12
">





<div className="
max-w-4xl
mx-auto
text-center
mb-14
">


<div className="
w-24
h-[1px]
bg-black
mx-auto
mb-8
">
</div>




<h1 className="
font-serif
text-5xl
font-semibold
tracking-[0.3em]
text-black
">

THE BARBER CLUB

</h1>




<p className="
mt-5
uppercase
tracking-[0.4em]
text-xs
text-gray-500
">

Private Grooming Experience

</p>




<div className="
w-24
h-[1px]
bg-black
mx-auto
mt-8
">
</div>



</div>









<div className="
max-w-xl
mx-auto
bg-white
rounded-[2.5rem]
shadow-[0_30px_80px_rgba(0,0,0,0.08)]
border
border-gray-200
overflow-hidden
">





<div className="
bg-black
rounded-b-[2.5rem]
p-10
text-center
">


<h2 className="
font-serif
text-3xl
text-white
">

Réservez votre séance

</h2>



<p className="
mt-3
text-gray-400
text-sm
tracking-widest
uppercase
">

Barber premium

</p>



</div>







<div className="
p-8
">







<h3 className="
font-serif
text-2xl
mb-7
text-black
">

Choisissez votre prestation

</h3>








<div className="
space-y-4
mb-12
">





{services.map(service=>(




<button


key={service.id}



onClick={()=>setSelectedService(service)}






className={

`

w-full
rounded-3xl
p-6
text-left
border
transition-all
duration-300


hover:-translate-y-1
hover:shadow-xl



${

selectedService?.id===service.id

?

"bg-black text-white border-black shadow-xl"

:

"bg-white text-black border-gray-200 hover:border-black"

}



`

}




>





<div className="
flex
justify-between
items-center
">





<div>


<h4 className="
font-serif
text-xl
">

{service.name}

</h4>



<p className="
text-sm
mt-2
opacity-60
">

{service.duration} minutes

</p>



</div>






<div className="
font-light
text-xl
">

{service.price} €

</div>





</div>




</button>




))}





</div>










{selectedService && (



<div className="mb-12">



<h3 className="
font-serif
text-2xl
mb-6
">

Choisissez votre date

</h3>






<input


type="date"


value={selectedDate}


onChange={(e)=>
setSelectedDate(e.target.value)
}



className="
w-full
rounded-2xl
p-5
border
border-gray-200
focus:border-black
focus:outline-none
"



/>



</div>



)}










{selectedDate && (



<div className="mb-12">



<h3 className="
font-serif
text-2xl
mb-6
">

Horaires disponibles

</h3>







<div className="
grid
grid-cols-3
gap-4
">





{availableTimes.map(time=>(




<button


key={time}



onClick={()=>setSelectedTime(time)}






className={

`

rounded-full
py-4
border
transition-all
duration-300


hover:-translate-y-1



${

selectedTime===time

?

"bg-black text-white border-black"

:

"bg-white text-black border-gray-300 hover:border-black"

}


`

}




>


{time}


</button>





))}




</div>







{
availableTimes.length===0 &&


<p className="
text-gray-500
text-center
mt-6
">

Aucun créneau disponible

</p>


}



</div>



)}{selectedTime && !confirmed && (


<form

onSubmit={handleSubmit}

className="
space-y-5
"

>


<h3 className="
font-serif
text-2xl
mb-8
">

Vos informations

</h3>





<input


type="text"


name="name"


placeholder="Nom complet"


value={form.name}


onChange={handleChange}



className="
w-full
rounded-2xl
p-5
border
border-gray-200
focus:outline-none
focus:border-black
transition
"



required


/>






<input


type="tel"


name="phone"


placeholder="Téléphone"


value={form.phone}


onChange={handleChange}



className="
w-full
rounded-2xl
p-5
border
border-gray-200
focus:outline-none
focus:border-black
transition
"



required


/>







<input


type="email"


name="email"


placeholder="Adresse email"


value={form.email}


onChange={handleChange}



className="
w-full
rounded-2xl
p-5
border
border-gray-200
focus:outline-none
focus:border-black
transition
"



required


/>









<button


type="submit"



className="
w-full
rounded-full
py-5
bg-black
text-white
uppercase
tracking-[0.25em]
text-sm
transition-all
duration-300
hover:bg-gray-800
hover:-translate-y-1
shadow-lg
"



>

Confirmer mon rendez-vous

</button>





</form>


)}









{confirmed && (



<div className="
mt-10
rounded-[2rem]
bg-[#F8F8F6]
border
border-gray-200
p-10
text-center
">





<div className="
w-16
h-16
rounded-full
bg-black
text-white
flex
items-center
justify-center
mx-auto
mb-6
text-2xl
">

✓

</div>







<h3 className="
font-serif
text-3xl
mb-8
">

Votre rendez-vous est confirmé

</h3>







<div className="
space-y-3
text-gray-600
">


<p className="
font-medium
text-black
">

{selectedService.name}

</p>


<p>

{selectedDate}

</p>


<p>

{selectedTime}

</p>



</div>







<div className="
mt-8
pt-6
border-t
border-gray-200
">


<p className="
font-serif
text-xl
">

Merci {form.name}

</p>



<p className="
mt-3
text-sm
uppercase
tracking-widest
text-gray-500
">

À bientôt au Barber Club

</p>



</div>





</div>



)}






</div>


</div>


</div>


)


}


export default Reservation