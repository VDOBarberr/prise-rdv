function Services(){

const prestations = [

{
image:"/images/coupe.jpg",
title:"Coupe Signature",
description:"Une coupe personnalisée avec dégradé, contours précis et finition professionnelle.",
price:"30 €"
},

{
image:"/images/barbe.jpg",
title:"Taille de barbe",
description:"Restructuration de la barbe, traçage des contours et soin adapté.",
price:"20 €"
},

{
image:"/images/coupe-barbe.jpg",
title:"Coupe + Barbe",
description:"L'expérience complète VDO Barber : coupe moderne et barbe parfaitement travaillée.",
price:"45 €"
},

{
image:"/images/enfant.jpg",
title:"Coupe Enfant",
description:"Une coupe adaptée aux plus jeunes dans une ambiance détendue.",
price:"20 €"
}

]


return (

<div className="
min-h-screen
bg-[#FAFAF8]
px-6
py-20
">


<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-5xl
md:text-6xl
font-serif
text-center
mb-6
">

Nos prestations

</h1>


<p className="
text-center
text-gray-500
mb-16
tracking-wide
">

L'expertise VDO Barber pour un style unique

</p>



<div className="
grid
md:grid-cols-2
gap-10
">



{prestations.map((item)=>(


<div

key={item.title}

className="
bg-white
rounded-[2.5rem]
overflow-hidden
border
border-gray-200
shadow-sm
hover:shadow-xl
hover:-translate-y-2
transition
duration-300
"


>


<img

src={item.image}

alt={item.title}

className="
w-full
h-80
object-cover
"

/>



<div className="
p-8
">


<h2 className="
text-3xl
font-serif
mb-4
">

{item.title}

</h2>



<p className="
text-gray-500
leading-relaxed
mb-6
">

{item.description}

</p>



<div className="
text-xl
font-bold
">

{item.price}

</div>


</div>


</div>


))}



</div>


</div>


</div>

)

}


export default Services