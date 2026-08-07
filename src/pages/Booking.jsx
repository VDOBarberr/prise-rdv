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
} =
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
} =
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
} =
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
relative
overflow-hidden
bg-[#FAFAF8]
text-black
p-5
md:p-10
">

<style>{`

@keyframes bookingFadeUp {

0% {
opacity:0;
transform:translateY(28px);
}

100% {
opacity:1;
transform:translateY(0);
}

}

@keyframes bookingFade {

0% {
opacity:0;
}

100% {
opacity:1;
}

}

@keyframes bookingScale {

0% {
opacity:0;
transform:scale(.96) translateY(12px);
}

100% {
opacity:1;
transform:scale(1) translateY(0);
}

}

@keyframes bookingSlot {

0% {
opacity:0;
transform:translateY(12px) scale(.96);
}

100% {
opacity:1;
transform:translateY(0) scale(1);
}

}

@keyframes bookingShimmer {

0% {
transform:translateX(-120%);
}

100% {
transform:translateX(120%);
}

}

.booking-fade-up {
animation:bookingFadeUp .8s cubic-bezier(.22,1,.36,1) both;
}

.booking-fade {
animation:bookingFade .7s ease both;
}

.booking-card {
animation:bookingScale .8s cubic-bezier(.22,1,.36,1) both;
}

.booking-slot {
animation:bookingSlot .6s cubic-bezier(.22,1,.36,1) both;
}

.booking-service {
animation:bookingFadeUp .45s cubic-bezier(.22,1,.36,1) both;
}

.booking-shimmer {
position:relative;
overflow:hidden;
}

.booking-shimmer::after {
content:"";
position:absolute;
top:0;
left:0;
width:45%;
height:100%;
background:linear-gradient(
90deg,
transparent,
rgba(255,255,255,.45),
transparent
);
transform:translateX(-120%);
pointer-events:none;
}

.booking-shimmer:hover::after {
animation:bookingShimmer .9s ease;
}

.booking-service-panel {
animation:bookingScale .35s cubic-bezier(.22,1,.36,1) both;
}

.booking-date-input {
color-scheme:light;
}

.booking-date-input::-webkit-calendar-picker-indicator {
opacity:.65;
cursor:pointer;
}

.booking-date-input::-webkit-calendar-picker-indicator:hover {
opacity:1;
}

.booking-input::placeholder {
color:#9b9b96;
}

.booking-input:focus {
box-shadow:
0 0 0 1px rgba(0,0,0,.12),
0 12px 40px rgba(0,0,0,.08);
}

.booking-scroll::-webkit-scrollbar {
width:5px;
}

.booking-scroll::-webkit-scrollbar-track {
background:transparent;
}

.booking-scroll::-webkit-scrollbar-thumb {
background:#d0d0cc;
border-radius:999px;
}

`}</style>


{/* ARRIÈRE-PLAN */}

<div className="
pointer-events-none
absolute
-top-40
-left-1/2
h-[500px]
w-[500px]
-translate-x-1/2
rounded-full
bg-black/[0.025]
blur-[120px]
" />

<div className="
pointer-events-none
absolute
right-[-180px]
top-[35%]
h-[400px]
w-[400px]
rounded-full
bg-black/[0.02]
blur-[120px]
" />


<div className="
relative
z-10
max-w-6xl
mx-auto
">


{/* HEADER */}

<div className="
booking-fade-up
text-center
mb-14
md:mb-20
">

<div className="
inline-flex
items-center
gap-4
mb-6
">

<div className="
h-px
w-10
bg-black
" />

<span className="
text-[10px]
md:text-xs
uppercase
tracking-[0.45em]
text-gray-500
">

VDO BARBER

</span>

<div className="
h-px
w-10
bg-black
" />

</div>


<h1 className="
font-serif
text-5xl
md:text-7xl
leading-none
tracking-[-0.03em]
text-black
">

Prendre

<span className="
block
italic
font-normal
text-gray-500
">

rendez-vous

</span>

</h1>


<p className="
mt-6
max-w-xl
mx-auto
text-sm
md:text-base
leading-7
text-gray-500
">

Choisissez votre date, votre horaire et votre prestation.
<br className="hidden md:block" />
Votre expérience commence ici.

</p>

</div>


{/* ÉTAPE 1 */}

<div className="
booking-card
relative
bg-white
border
border-gray-100
rounded-[2rem]
md:rounded-[2.75rem]
p-6
md:p-10
mb-7
shadow-[0_30px_100px_rgba(0,0,0,.08)]
">

<div className="
flex
items-start
justify-between
gap-5
mb-8
">

<div className="
flex
items-start
gap-5
">

<div className="
flex
items-center
justify-center
shrink-0
h-11
w-11
rounded-full
bg-black
text-white
font-serif
">

01

</div>


<div>

<p className="
text-[10px]
uppercase
tracking-[0.35em]
text-gray-400
mb-2
">

Première étape

</p>

<h2 className="
font-serif
text-2xl
md:text-3xl
text-black
">

Choisir une date

</h2>

</div>

</div>


<div className="
hidden
md:block
text-right
">

<p className="
text-xs
text-gray-400
">

Disponibilités en temps réel

</p>

</div>

</div>


<div className="
relative
group
">

<div className="
pointer-events-none
absolute
inset-0
rounded-2xl
bg-black/[0.025]
opacity-0
group-focus-within:opacity-100
transition-opacity
duration-500
" />

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
booking-date-input
relative
w-full
bg-[#FAFAF8]
border
border-gray-200
p-5
md:p-6
rounded-2xl
text-black
text-base
outline-none
transition-all
duration-500
hover:border-gray-400
focus:border-black
focus:bg-white
"

/>

</div>

</div>


{/* ÉTAPE 2 */}

{

selectedDate && (

<div className="
booking-card
relative
z-20
bg-white
border
border-gray-100
rounded-[2rem]
md:rounded-[2.75rem]
p-6
md:p-10
mb-7
shadow-[0_30px_100px_rgba(0,0,0,.08)]
">

<div className="
flex
items-start
gap-5
mb-8
">

<div className="
flex
items-center
justify-center
shrink-0
h-11
w-11
rounded-full
bg-black
text-white
font-serif
">

02

</div>


<div>

<p className="
text-[10px]
uppercase
tracking-[0.35em]
text-gray-400
mb-2
">

Deuxième étape

</p>


<h2 className="
font-serif
text-2xl
md:text-3xl
text-black
">

Choisir votre horaire

</h2>


<p className="
mt-2
text-sm
text-gray-400
">

Disponibilités pour le {selectedDate}

</p>

</div>

</div>


{

availableSlots.length > 0

?

<div className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-4
gap-3
md:gap-4
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
booking-slot
booking-shimmer
relative
p-5
md:p-6
rounded-2xl
border
font-medium
text-sm
md:text-base
overflow-hidden
transition-all
duration-500
ease-[cubic-bezier(.22,1,.36,1)]

${
selectedSlot?.id === slot.id

?

"bg-black text-white border-black scale-[1.03] shadow-[0_15px_45px_rgba(0,0,0,.20)]"

:

"bg-[#FAFAF8] text-black border-gray-200 hover:border-black hover:bg-white hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,.10)]"

}

`}

>

<span className="
relative
z-10
">

{slot.time}

</span>


{

selectedSlot?.id === slot.id && (

<span className="
relative
z-10
block
text-[9px]
uppercase
tracking-[0.25em]
mt-2
opacity-60
">

Sélectionné

</span>

)

}

</button>

))

}

</div>


:

<div className="
rounded-2xl
border
border-gray-100
bg-[#FAFAF8]
p-8
text-center
">

<div className="
mx-auto
mb-5
h-12
w-12
rounded-full
border
border-gray-200
flex
items-center
justify-center
">

<div className="
h-1.5
w-1.5
rounded-full
bg-black
" />

</div>


<p className="
font-serif
text-xl
text-black
">

Aucun créneau disponible

</p>


<p className="
mt-2
text-sm
text-gray-400
">

Veuillez sélectionner une autre date.

</p>

</div>

}

</div>

)

}


{/* ÉTAPE 3 */}

{

selectedSlot && (

<div className="
booking-card
relative
z-30
bg-white
text-black
border
border-gray-100
rounded-[2rem]
md:rounded-[2.75rem]
p-6
md:p-10
max-w-3xl
mx-auto
shadow-[0_35px_100px_rgba(0,0,0,.10)]
overflow-visible
">

<div className="
absolute
top-0
right-0
h-32
w-32
rounded-full
bg-black/[0.025]
blur-3xl
pointer-events-none
" />


<div className="
relative
z-10
">

<div className="
flex
items-start
gap-5
mb-8
">

<div className="
flex
items-center
justify-center
shrink-0
h-11
w-11
rounded-full
bg-black
text-white
font-serif
">

03

</div>


<div>

<p className="
text-[10px]
uppercase
tracking-[0.35em]
text-gray-400
mb-2
">

Dernière étape

</p>


<h2 className="
font-serif
text-3xl
md:text-4xl
">

Votre réservation

</h2>

</div>

</div>


<form

onSubmit={createAppointment}

className="
space-y-5
"

>


{/* RÉCAPITULATIF */}

<div className="
booking-shimmer
relative
overflow-hidden
rounded-2xl
bg-black
text-white
p-6
shadow-[0_15px_45px_rgba(0,0,0,.15)]
">

<div className="
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-5
">

<div>

<p className="
text-[9px]
uppercase
tracking-[0.35em]
text-gray-400
mb-2
">

Votre créneau

</p>


<p className="
font-serif
text-xl
">

{selectedSlot.date}

</p>


<p className="
text-sm
text-gray-400
mt-1
">

{selectedSlot.time}

</p>

</div>


<div className="
h-px
sm:h-12
sm:w-px
w-full
bg-white/10
" />


<div className="sm:text-right">

<p className="
text-[9px]
uppercase
tracking-[0.35em]
text-gray-400
mb-2
">

Prestation

</p>


<p className="
font-serif
text-lg
">

{form.service || "À sélectionner"}

</p>

</div>

</div>

</div>


{/* INFORMATIONS */}

<div className="
grid
md:grid-cols-2
gap-4
">

<div>

<label className="
block
text-[10px]
uppercase
tracking-[0.25em]
text-gray-500
mb-2
">

Nom

</label>


<input

className="
booking-input
w-full
bg-[#FAFAF8]
border
border-gray-200
p-4
rounded-xl
text-black
outline-none
transition-all
duration-500
hover:border-gray-400
focus:border-black
"

placeholder="Votre nom"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>

</div>


<div>

<label className="
block
text-[10px]
uppercase
tracking-[0.25em]
text-gray-500
mb-2
">

Téléphone

</label>


<input

className="
booking-input
w-full
bg-[#FAFAF8]
border
border-gray-200
p-4
rounded-xl
text-black
outline-none
transition-all
duration-500
hover:border-gray-400
focus:border-black
"

placeholder="Votre téléphone"

value={form.phone}

onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

/>

</div>

</div>


<div>

<label className="
block
text-[10px]
uppercase
tracking-[0.25em]
text-gray-500
mb-2
">

Email

</label>


<input

className="
booking-input
w-full
bg-[#FAFAF8]
border
border-gray-200
p-4
rounded-xl
text-black
outline-none
transition-all
duration-500
hover:border-gray-400
focus:border-black
"

placeholder="votre@email.com"

value={form.email}

onChange={(e)=>

setForm({

...form,

email:e.target.value

})

}

/>

</div>


{/* PRESTATIONS */}

<div className="
relative
z-[100]
">

<label className="
block
text-[10px]
uppercase
tracking-[0.25em]
text-gray-500
mb-2
">

Prestation

</label>


<button

type="button"

onClick={()=>setShowServices(!showServices)}

className="
booking-shimmer
relative
w-full
bg-[#FAFAF8]
border
border-gray-200
p-5
rounded-xl
text-left
transition-all
duration-500
hover:border-black
hover:bg-white
hover:shadow-[0_12px_35px_rgba(0,0,0,.08)]
"

>

<div className="
flex
items-center
justify-between
gap-4
">

<div>

<p className={`
font-medium
transition-all
duration-300

${
form.service
?
"text-black"
:
"text-gray-400"
}

`}>

{

form.service

?

form.service

:

"Choisir une prestation"

}

</p>


{

form.service && (

<p className="
text-[9px]
uppercase
tracking-[0.2em]
text-gray-400
mt-1
">

Prestation sélectionnée

</p>

)

}

</div>


<div className={`
flex
items-center
justify-center
h-8
w-8
rounded-full
bg-black
text-white
transition-transform
duration-500

${
showServices
?
"rotate-180"
:
"rotate-0"
}

`}>

<span className="
text-xs
">

⌄

</span>

</div>

</div>

</button>


{

showServices && (

<div className="
booking-service-panel
booking-scroll
absolute
z-[9999]
mt-3
w-full
max-h-[360px]
overflow-y-auto
bg-black
rounded-2xl
shadow-[0_25px_70px_rgba(0,0,0,.30)]
border
border-gray-800
p-2
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
booking-service
group
w-full
p-5
text-left
rounded-xl
transition-all
duration-500
hover:bg-white/[0.08]
hover:translate-x-1
"

>

<div className="
flex
justify-between
items-center
gap-4
">

<p className="
font-serif
text-lg
text-white
group-hover:text-gray-300
transition-colors
duration-300
">

{service.name}

</p>


<p className="
font-medium
text-white
">

{service.price}

</p>

</div>


<p className="
text-sm
text-gray-500
mt-2
leading-6
">

{service.description}

</p>


<div className="
mt-4
h-px
w-0
bg-white
group-hover:w-full
transition-all
duration-500
" />

</button>

))

}

</div>

)

}

</div>


{/* CONFIRMATION */}

<button

type="submit"

className="
booking-shimmer
relative
w-full
overflow-hidden
bg-black
text-white
py-5
rounded-full
uppercase
tracking-[0.28em]
text-[10px]
md:text-xs
font-medium
transition-all
duration-500
hover:bg-gray-800
hover:scale-[1.015]
hover:shadow-[0_20px_45px_rgba(0,0,0,.18)]
active:scale-[.98]
"

>

<span className="
relative
z-10
">

Confirmer le rendez-vous

</span>

</button>


<button

type="button"

onClick={()=>setSelectedSlot(null)}

className="
w-full
border
border-gray-200
text-gray-500
py-4
rounded-full
text-[10px]
uppercase
tracking-[0.25em]
transition-all
duration-500
hover:border-black
hover:text-black
hover:bg-[#FAFAF8]
"

>

Changer d'horaire

</button>


</form>

</div>

</div>

)

}


{/* SIGNATURE */}

<div className="
booking-fade
relative
z-0
text-center
mt-12
pb-6
">

<div className="
flex
items-center
justify-center
gap-4
mb-4
">

<div className="
h-px
w-12
bg-gray-200
" />

<span className="
text-black
text-xs
font-serif
">

V

</span>

<div className="
h-px
w-12
bg-gray-200
" />

</div>


<p className="
text-[9px]
uppercase
tracking-[0.4em]
text-gray-400
">

VDO BARBER — EXPERIENCE

</p>

</div>


</div>

</div>

)

}

export default Booking