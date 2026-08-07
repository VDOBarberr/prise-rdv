import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import Services from "./pages/Services"
import Home from "./pages/Home"
import Reservation from "./pages/Reservation"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Prestations from "./pages/Prestations"
import ProtectedRoute from "./components/ProtectedRoute"

import { supabase } from "./services/supabase"



function Navbar() {

const navigate = useNavigate()

const [session, setSession] = useState(null)



useEffect(() => {

supabase.auth.getSession()
.then(({data})=>{
setSession(data.session)
})


const {data: listener} = supabase.auth.onAuthStateChange(
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
flex
items-center
justify-between
px-8
py-6
">


<Link
to="/"
className="
text-3xl
font-serif
font-bold
tracking-wide
"
>
VDO Barber
</Link>



<nav className="
flex
items-center
gap-8
">


<Link
to="/"
className="
text-xs
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
"
>
Accueil
</Link>



<Link
to="/prestations"
className="
text-xs
uppercase
tracking-[0.25em]
text-gray-600
hover:text-black
"
>
Prestations
</Link>



<Link
to="/reservation"
className="
px-7
py-3
rounded-full
bg-black
text-white
text-xs
uppercase
tracking-[0.25em]
"
>
Réserver
</Link>



{session && (

<Link
to="/admin"
className="
text-xs
uppercase
tracking-[0.25em]
"
>
Planning
</Link>

)}



{!session && (

<Link
to="/login"
className="
text-xs
uppercase
tracking-[0.25em]
"
>
Admin
</Link>

)}



{session && (

<button
onClick={logout}
className="
text-xs
uppercase
tracking-[0.25em]
"
>
Déconnexion
</button>

)}


</nav>


</header>

)

}





function App(){

return (

<BrowserRouter>


<Navbar />


<Routes>


<Route
path="/"
element={<Home />}
/>


<Route
path="/reservation"
element={<Reservation />}
/>


<Route
path="/prestations"
element={<Prestations />}
/>


<Route
path="/services"
element={<Services />}
/>


<Route
path="/login"
element={<Login />}
/>


<Route
path="/admin"
element={
<ProtectedRoute>
<Admin />
</ProtectedRoute>
}
/>


</Routes>


</BrowserRouter>

)

}


export default App