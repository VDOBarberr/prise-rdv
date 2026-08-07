import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../services/supabase"


function Navbar() {

const navigate = useNavigate()

const [session, setSession] = useState(null)



useEffect(() => {

supabase.auth.getSession()

.then(({data})=>{

setSession(data.session)

})



const {
data: listener
} = supabase.auth.onAuthStateChange(

(_event, session)=>{

setSession(session)

}

)



return ()=>{

listener.subscription.unsubscribe()

}

},[])



async function logout(){

await supabase.auth.signOut()

navigate("/login")

}



return (

<header className="
w-full
px-6
py-5
flex
items-center
justify-between
bg-white
">


{/* LOGO */}

<Link to="/">

<img

src="/logo.png"

alt="VDO Barber"

className="
h-16
md:h-20
w-auto
object-contain
"

/>

</Link>



{/* MENU */}

<nav className="
flex
items-center
gap-8
">



<Link

to="/"

className="
text-sm
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
transition
duration-300
"

>

Accueil

</Link>



<Link

to="/prestations"

className="
text-sm
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
transition
duration-300
"

>

Prestations

</Link>



<Link

to="/reservation"

className="
px-8
py-3
rounded-full
bg-black
text-white
text-sm
uppercase
tracking-[0.2em]
hover:bg-gray-800
hover:-translate-y-1
transition
duration-300
shadow-md
"

>

Réserver

</Link>



{session && (

<Link

to="/admin"

className="
text-sm
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
transition
duration-300
"

>

Planning

</Link>

)}



{!session && (

<Link

to="/login"

className="
text-sm
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
transition
duration-300
"

>

Admin

</Link>

)}



{session && (

<button

onClick={logout}

className="
text-sm
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
transition
duration-300
"

>

Déconnexion

</button>

)}



</nav>


</header>

)

}


export default Navbar