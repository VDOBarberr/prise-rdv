function Prestations() {

  const coupes = [

    {
      name: "Burst Fade",
      description:
        "Un dégradé arrondi autour de l’oreille pour un style moderne, marqué et tendance.",
      image: "/images/burst-fade.jpg"
    },

    {
      name: "Taper Fade",
      description:
        "Un dégradé discret sur les tempes et la nuque pour une finition propre et élégante.",
      image: "/images/taper-fade.jpg"
    },

    {
      name: "Mid Fade",
      description:
        "Un dégradé intermédiaire qui apporte un équilibre parfait entre volume et précision.",
      image: "/images/mid-fade.jpg"
    }

  ]


  return (

    <div className="
      min-h-screen
      bg-[#FAFAF8]
      text-black
      overflow-hidden
    ">


      <style>{`

        @keyframes prestationsFadeUp {

          0% {
            opacity: 0;
            transform: translateY(35px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }

        }


        @keyframes prestationsScale {

          0% {
            opacity: 0;
            transform: scale(.96);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }

        }


        @keyframes prestationsImage {

          0% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }

        }


        @keyframes prestationsShimmer {

          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(120%);
          }

        }


        .prestations-fade-up {
          animation:
            prestationsFadeUp
            .9s
            cubic-bezier(.22,1,.36,1)
            both;
        }


        .prestations-scale {
          animation:
            prestationsScale
            .9s
            cubic-bezier(.22,1,.36,1)
            both;
        }


        .prestations-card {

          transition:
            transform .6s cubic-bezier(.22,1,.36,1),
            box-shadow .6s cubic-bezier(.22,1,.36,1),
            border-color .4s ease;

        }


        .prestations-card:hover {

          transform: translateY(-10px);

          box-shadow:
            0 30px 80px rgba(0,0,0,.13);

          border-color: #d4d4d0;

        }


        .prestations-image {

          transition:
            transform .9s cubic-bezier(.22,1,.36,1);

        }


        .prestations-card:hover .prestations-image {

          transform: scale(1.06);

        }


        .prestations-overlay {

          transition:
            opacity .5s ease;

        }


        .prestations-card:hover .prestations-overlay {

          opacity: .18;

        }


        .prestations-number {

          transition:
            background-color .5s ease,
            color .5s ease,
            transform .5s cubic-bezier(.22,1,.36,1);

        }


        .prestations-card:hover .prestations-number {

          background: #000;

          color: #fff;

          transform: scale(1.08);

        }


        .prestations-arrow {

          transition:
            transform .5s cubic-bezier(.22,1,.36,1),
            opacity .4s ease;

        }


        .prestations-card:hover .prestations-arrow {

          transform:
            translate(4px, -4px);

        }


        .prestations-shimmer {

          position: relative;

          overflow: hidden;

        }


        .prestations-shimmer::after {

          content: "";

          position: absolute;

          top: 0;
          left: 0;

          width: 40%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.3),
              transparent
            );

          transform:
            translateX(-120%);

          pointer-events: none;

        }


        .prestations-shimmer:hover::after {

          animation:
            prestationsShimmer
            .9s
            ease;

        }

      `}</style>



      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <section className="
        relative
        min-h-[75vh]
        flex
        items-center
        px-5
        md:px-10
        py-24
        overflow-hidden
      ">


        {/* Décor */}

        <div className="
          pointer-events-none
          absolute
          top-[-180px]
          left-1/2
          -translate-x-1/2
          h-[550px]
          w-[550px]
          rounded-full
          bg-black/[0.025]
          blur-[130px]
        " />


        <div className="
          pointer-events-none
          absolute
          bottom-[-200px]
          right-[-150px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-black/[0.02]
          blur-[120px]
        " />


        <div className="
          relative
          z-10
          max-w-6xl
          mx-auto
          w-full
        ">


          <div className="
            max-w-3xl
            prestations-fade-up
          ">


            <div className="
              flex
              items-center
              gap-4
              mb-8
            ">

              <span className="
                text-[9px]
                uppercase
                tracking-[0.45em]
                text-gray-400
              ">
                03
              </span>


              <div className="
                h-px
                w-12
                bg-black
              " />


              <span className="
                text-[9px]
                uppercase
                tracking-[0.45em]
                text-gray-400
              ">
                VDO Barber
              </span>

            </div>



            <p className="
              text-[10px]
              uppercase
              tracking-[0.45em]
              text-gray-400
              mb-5
            ">
              Prestations
            </p>



            <h1 className="
              font-serif
              text-6xl
              sm:text-7xl
              md:text-8xl
              leading-[.88]
              tracking-[-0.05em]
            ">

              L'art

              <span className="
                block
                italic
                font-normal
                text-gray-500
                mt-3
              ">
                du Fade
              </span>

            </h1>



            <div className="
              h-px
              bg-black/15
              my-9
              max-w-xl
            " />



            <p className="
              max-w-2xl
              text-sm
              md:text-base
              leading-8
              text-gray-500
            ">

              Découvrez nos différentes techniques de dégradé,
              réalisées avec précision pour s'adapter à votre
              style et à votre personnalité.

            </p>

          </div>



          {/* Indicateur */}

          <div className="
            mt-16
            flex
            items-center
            gap-5
            text-gray-400
          ">

            <div className="
              h-10
              w-px
              bg-gradient-to-b
              from-black
              to-transparent
            " />


            <span className="
              text-[8px]
              uppercase
              tracking-[0.4em]
            ">
              Découvrir nos coupes
            </span>

          </div>

        </div>

      </section>



      {/* ================================= */}
      {/* COUPES */}
      {/* ================================= */}

      <section className="
        relative
        px-5
        md:px-10
        pb-28
        md:pb-40
      ">


        <div className="
          max-w-6xl
          mx-auto
        ">


          <div className="
            grid
            md:grid-cols-3
            gap-6
          ">


            {coupes.map((coupe, index) => (

              <div
                key={index}
                className="
                  prestations-card
                  group
                  relative
                  bg-white
                  rounded-[2rem]
                  overflow-hidden
                  border
                  border-gray-100
                  prestations-scale
                "
                style={{
                  animationDelay: `${index * 120}ms`
                }}
              >


                {/* IMAGE */}

                <div className="
                  relative
                  h-[420px]
                  md:h-[460px]
                  overflow-hidden
                  bg-gray-100
                ">


                  <img
                    src={coupe.image}
                    alt={coupe.name}
                    className="
                      prestations-image
                      w-full
                      h-full
                      object-cover
                    "
                  />


                  {/* Overlay */}

                  <div className="
                    prestations-overlay
                    absolute
                    inset-0
                    bg-black
                    opacity-0
                  " />


                  {/* Numéro */}

                  <div className="
                    absolute
                    top-6
                    left-6
                  ">

                    <div className="
                      prestations-number
                      h-11
                      w-11
                      rounded-full
                      bg-white/90
                      backdrop-blur-sm
                      flex
                      items-center
                      justify-center
                      text-[10px]
                      font-medium
                    ">

                      0{index + 1}

                    </div>

                  </div>


                  {/* Flèche */}

                  <div className="
                    absolute
                    top-6
                    right-6
                    h-11
                    w-11
                    rounded-full
                    bg-white/90
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    text-lg
                    prestations-arrow
                  ">

                    ↗

                  </div>

                </div>



                {/* CONTENU */}

                <div className="
                  p-7
                  md:p-9
                ">


                  <div className="
                    flex
                    items-center
                    gap-4
                    mb-5
                  ">

                    <div className="
                      h-px
                      w-8
                      bg-black
                    " />

                    <span className="
                      text-[8px]
                      uppercase
                      tracking-[0.35em]
                      text-gray-400
                    ">
                      VDO Barber
                    </span>

                  </div>



                  <h2 className="
                    font-serif
                    text-3xl
                    md:text-4xl
                    mb-4
                  ">

                    {coupe.name}

                  </h2>



                  <p className="
                    text-sm
                    leading-7
                    text-gray-400
                  ">

                    {coupe.description}

                  </p>


                </div>


              </div>

            ))}

          </div>

        </div>

      </section>



      {/* ================================= */}
      {/* CTA */}
      {/* ================================= */}

      <section className="
        relative
        px-5
        md:px-10
        py-28
        md:py-36
        bg-black
        text-white
        overflow-hidden
      ">


        <div className="
          pointer-events-none
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          h-[450px]
          w-[450px]
          rounded-full
          border
          border-white/[0.05]
        " />


        <div className="
          pointer-events-none
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          h-[650px]
          w-[650px]
          rounded-full
          border
          border-white/[0.03]
        " />


        <div className="
          relative
          z-10
          max-w-4xl
          mx-auto
          text-center
          prestations-fade-up
        ">


          <div className="
            flex
            items-center
            justify-center
            gap-4
            mb-8
          ">

            <div className="
              h-px
              w-10
              bg-white/30
            " />


            <span className="
              text-[9px]
              uppercase
              tracking-[0.45em]
              text-gray-500
            ">
              VDO BARBER
            </span>


            <div className="
              h-px
              w-10
              bg-white/30
            " />

          </div>



          <h2 className="
            font-serif
            text-5xl
            md:text-7xl
            lg:text-8xl
            leading-[.9]
            tracking-[-0.04em]
          ">

            Votre prochain

            <span className="
              block
              italic
              font-normal
              text-gray-500
              mt-4
            ">
              style commence ici
            </span>

          </h2>



          <p className="
            max-w-lg
            mx-auto
            mt-8
            text-sm
            md:text-base
            leading-7
            text-gray-500
          ">

            Choisissez votre style et réservez
            votre prochain rendez-vous chez VDO Barber.

          </p>



          <a
            href="/reservation"
            className="
              prestations-shimmer
              inline-flex
              items-center
              justify-center
              mt-10
              bg-white
              text-black
              px-12
              py-5
              rounded-full
              tracking-[0.2em]
              uppercase
              text-[10px]
              font-medium
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_20px_50px_rgba(255,255,255,.12)]
            "
          >

            Réserver votre rendez-vous

          </a>

        </div>

      </section>



      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer className="
        bg-[#FAFAF8]
        px-5
        md:px-10
        py-10
      ">

        <div className="
          max-w-6xl
          mx-auto
        ">

          <div className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-6
          ">


            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                h-9
                w-9
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                font-serif
                text-sm
              ">
                V
              </div>


              <div>

                <p className="
                  font-serif
                  text-lg
                ">
                  VDO Barber
                </p>


                <p className="
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-gray-400
                  mt-1
                ">
                  Experience masculine
                </p>

              </div>

            </div>


            <p className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-gray-400
            ">
              Victor.
            </p>


          </div>

        </div>

      </footer>


    </div>

  )

}


export default Prestations