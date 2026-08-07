import { useState } from "react"
import { supabase } from "../services/supabase"
import { useNavigate } from "react-router-dom"


function Login(){


const navigate = useNavigate()


const [email,setEmail] = useState("")

const [password,setPassword] = useState("")

const [error,setError] = useState("")

const [loading,setLoading] = useState(false)





async function handleLogin(e){


e.preventDefault()

setError("")

setLoading(true)



const {

error

} = await supabase.auth.signInWithPassword({

email,

password

})



if(error){

setError("Email ou mot de passe incorrect")

setLoading(false)

return

}



navigate("/admin")


}





return (

<div className="
min-h-screen
bg-[#FAFAF8]
flex
items-center
justify-center
px-6
">



<div className="
w-full
max-w-md
bg-white
rounded-[2.5rem]
shadow-xl
p-10
border
border-gray-100
">





<div className="
text-center
mb-10
">



<p className="
uppercase
tracking-[0.4em]
text-xs
text-gray-400
mb-4
">

Espace privé

</p>



<h1 className="
text-4xl
font-serif
font-bold
text-black
">

VDO Barber

</h1>



<p className="
text-gray-500
mt-3
">

Administration

</p>



</div>






<form

onSubmit={handleLogin}

className="
space-y-5
"

>





<input

type="email"

placeholder="Adresse email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
transition
"

/>







<input

type="password"

placeholder="Mot de passe"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="
w-full
p-4
rounded-2xl
border
border-gray-200
focus:outline-none
focus:border-black
transition
"

/>







{error && (

<p className="
text-red-500
text-sm
text-center
">

{error}

</p>

)}







<button

disabled={loading}

className="
w-full
py-4
rounded-full
bg-black
text-white
uppercase
tracking-[0.3em]
text-sm
hover:bg-gray-800
transition
duration-300
disabled:opacity-50
"

>

{

loading

?

"Connexion..."

:

"Se connecter"

}



</button>





</form>



</div>


</div>


)

}


export default Login