function Home() {

return (

<div className="min-h-screen bg-[#FAFAF8] text-black">


{/* HERO */}

<section className="
min-h-screen
flex
items-center
justify-center
px-6
">

<div className="
max-w-5xl
text-center
">


<p className="
text-xs
uppercase
tracking-[0.6em]
text-gray-500
mb-10
">

Barber Studio

</p>




<h1 className="
text-6xl
md:text-8xl
font-serif
font-semibold
tracking-wide
mb-10
">

VDO Barber

</h1>




<div className="
w-24
h-[1px]
bg-black
mx-auto
mb-10
">
</div>





<p className="
text-xl
text-gray-600
max-w-2xl
mx-auto
leading-relaxed
mb-12
">

Un espace dédié à l'élégance masculine,
où chaque détail est pensé pour offrir
une expérience unique.

</p>





<a

href="/reservation"

className="
inline-flex
items-center
justify-center
bg-black
text-white
px-10
py-5
rounded-full
tracking-wide
transition-all
duration-300
hover:bg-gray-800
hover:-translate-y-1
shadow-lg
"

>

Réserver votre rendez-vous

</a>



</div>


</section>








{/* PRESENTATION */}


<section className="
py-28
px-6
">


<div className="
max-w-6xl
mx-auto
grid
md:grid-cols-2
gap-16
items-center
">



<div>


<p className="
uppercase
tracking-[0.4em]
text-xs
text-gray-500
mb-6
">

Notre philosophie

</p>





<h2 className="
text-5xl
font-serif
font-semibold
mb-8
">

L'art du détail

</h2>





<p className="
text-gray-600
leading-relaxed
text-lg
">

Chez VDO Barber, chaque prestation est réalisée
avec précision et exigence. Notre objectif :
proposer une expérience masculine élégante
dans un environnement moderne et raffiné.

</p>



</div>







<div className="
bg-white
rounded-[3rem]
h-96
flex
items-center
justify-center
shadow-[0_30px_80px_rgba(0,0,0,0.08)]
border
border-gray-200
">



<div className="text-center">



<p className="
text-6xl
font-serif
tracking-wide
">

VDO

</p>



<p className="
uppercase
tracking-[0.5em]
text-xs
mt-5
text-gray-500
">

Barber

</p>



</div>



</div>



</div>


</section>









{/* SERVICES PREVIEW */}


<section className="
py-28
px-6
bg-white
">


<div className="
max-w-6xl
mx-auto
text-center
">



<p className="
uppercase
tracking-[0.4em]
text-xs
text-gray-500
mb-6
">

Prestations

</p>





<h2 className="
text-5xl
font-serif
font-semibold
mb-14
">

Nos services

</h2>








<div className="
grid
md:grid-cols-3
gap-8
">





<div className="
bg-[#FAFAF8]
p-10
rounded-[2rem]
border
border-gray-200
transition-all
duration-300
hover:-translate-y-2
hover:shadow-xl
">


<h3 className="
text-2xl
font-serif
mb-5
">

Coupe

</h3>



<p className="
text-gray-600
leading-relaxed
">

Une coupe personnalisée adaptée à votre style, avec un travail précis des longueurs, des volumes et des finitions pour un résultat soigné.


</p>


</div>







<div className="
bg-[#FAFAF8]
p-10
rounded-[2rem]
border
border-gray-200
transition-all
duration-300
hover:-translate-y-2
hover:shadow-xl
">



<h3 className="
text-2xl
font-serif
mb-5
">

Coupe + Barbe

</h3>



<p className="
text-gray-600
leading-relaxed
">

Une prestation complète pour harmoniser la coupe de cheveux et la barbe, avec un travail précis des longueurs, des volumes et des contours pour un style soigné.


</p>



</div>







<div className="
bg-[#FAFAF8]
p-10
rounded-[2rem]
border
border-gray-200
transition-all
duration-300
hover:-translate-y-2
hover:shadow-xl
">



<h3 className="
text-2xl
font-serif
mb-5
">

Coupe Transformation

</h3>



<p className="
text-gray-600
leading-relaxed
">

C’est une coupe réalisée après environ 2 mois de pousse pour pouvoir restructurer la chevelure. Elle permet de modifier la forme, la longueur et le volume afin de créer un nouveau style.

</p>



</div>





</div>


</div>


</section>









{/* CTA */}


<section className="
py-28
px-6
text-center
">



<h2 className="
text-5xl
font-serif
font-semibold
mb-8
">

Prenez rendez-vous chez VDO Barber

</h2>




<p className="
text-gray-600
mb-12
text-lg
">

Réservez votre expérience premium en quelques secondes.

</p>






<a

href="/reservation"

className="
inline-flex
bg-black
text-white
px-12
py-5
rounded-full
tracking-wide
transition-all
duration-300
hover:bg-gray-800
hover:-translate-y-1
shadow-lg
"

>

Réserver

</a>



</section>








<footer className="
bg-black
text-white
text-center
py-10
">



<p className="
font-serif
text-2xl
tracking-wide
">

VDO Barber

</p>



<p className="
text-gray-400
text-sm
mt-3
tracking-widest
uppercase
">

Victor.

</p>



</footer>





</div>

)

}


export default Home