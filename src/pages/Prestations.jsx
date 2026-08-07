function Prestations(){

const coupes = [

{
name:"Burst Fade",
description:"Un dégradé arrondi autour de l’oreille pour un style moderne, marqué et tendance.",
image:"/images/burst-fade.jpg"
},

{
name:"Taper Fade",
description:"Un dégradé discret sur les tempes et la nuque pour une finition propre et élégante.",
image:"/images/taper-fade.jpg"
},

{
name:"Mid Fade",
description:"Un dégradé intermédiaire qui apporte un équilibre parfait entre volume et précision.",
image:"/images/mid-fade.jpg"
}

]


return (

<div className="
min-h-screen
bg-white
px-6
py-20
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-4xl
font-serif
font-bold
text-center
mb-4
">
Nos réalisations
</h1>


<p className="
text-center
text-gray-500
mb-12
">
Découvrez nos techniques de coupe
</p>



<div className="
grid
md:grid-cols-3
gap-8
">


{coupes.map((coupe,index)=>(


<div

key={index}

className="
rounded-3xl
overflow-hidden
border
border-gray-200
hover:shadow-xl
transition-all
duration-300
hover:-translate-y-1
"


>


<img

src={coupe.image}

alt={coupe.name}

className="
w-full
h-96
object-cover
"

/>



<div className="
p-6
">


<h2 className="
text-xl
font-semibold
mb-3
">

{coupe.name}

</h2>


<p className="
text-gray-600
leading-relaxed
">

{coupe.description}

</p>


</div>


</div>


))}


</div>


</div>


</div>

)

}


export default Prestations