function Home() {

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-black overflow-hidden">

      <style>{`

        @keyframes homeFadeUp {
          0% {
            opacity: 0;
            transform: translateY(35px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes homeFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes homeScale {
          0% {
            opacity: 0;
            transform: scale(.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes homeShimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes homeFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .home-fade-up {
          animation: homeFadeUp .9s cubic-bezier(.22,1,.36,1) both;
        }

        .home-fade {
          animation: homeFade .8s ease both;
        }

        .home-scale {
          animation: homeScale .9s cubic-bezier(.22,1,.36,1) both;
        }

        .home-shimmer {
          position: relative;
          overflow: hidden;
        }

        .home-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.35),
            transparent
          );
          transform: translateX(-120%);
          pointer-events: none;
        }

        .home-shimmer:hover::after {
          animation: homeShimmer .9s ease;
        }

        .home-float {
          animation: homeFloat 5s ease-in-out infinite;
        }

        .home-service-card {
          transition:
            transform .6s cubic-bezier(.22,1,.36,1),
            box-shadow .6s cubic-bezier(.22,1,.36,1),
            border-color .4s ease;
        }

        .home-service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 70px rgba(0,0,0,.10);
          border-color: #d4d4d0;
        }

        .home-service-number {
          transition:
            background-color .5s ease,
            color .5s ease,
            transform .5s cubic-bezier(.22,1,.36,1);
        }

        .home-service-card:hover .home-service-number {
          background: #000;
          color: #fff;
          transform: scale(1.08);
        }

        .home-word {
          transition:
            letter-spacing .7s cubic-bezier(.22,1,.36,1),
            transform .7s cubic-bezier(.22,1,.36,1);
        }

        .home-word:hover {
          letter-spacing: .08em;
          transform: translateX(5px);
        }

        .home-button {
          transition:
            transform .4s cubic-bezier(.22,1,.36,1),
            box-shadow .4s ease,
            background-color .3s ease;
        }

        .home-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 40px rgba(0,0,0,.16);
        }

      `}</style>


      {/* HERO */}

      <section className="
        relative
        min-h-screen
        flex
        items-center
        px-5
        md:px-10
        py-20
        overflow-hidden
      ">

        <div className="
          pointer-events-none
          absolute
          top-[-220px]
          left-1/2
          h-[650px]
          w-[650px]
          -translate-x-1/2
          rounded-full
          bg-black/[0.025]
          blur-[130px]
        " />

        <div className="
          pointer-events-none
          absolute
          bottom-[-180px]
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
          max-w-7xl
          w-full
          mx-auto
        ">

          <div className="
            grid
            lg:grid-cols-[1.15fr_.85fr]
            gap-14
            lg:gap-20
            items-center
          ">


            {/* TEXTE */}

            <div className="
              text-center
              lg:text-left
            ">

              <div className="
                home-fade-up
                inline-flex
                items-center
                gap-4
                mb-8
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
                  Barber Studio
                </span>

                <div className="
                  h-px
                  w-10
                  bg-black
                  lg:hidden
                " />

              </div>


              <h1 className="
                home-fade-up
                font-serif
                text-[4.2rem]
                sm:text-7xl
                md:text-8xl
                lg:text-[7.5rem]
                leading-[.82]
                tracking-[-0.05em]
              ">

                VDO

                <span className="
                  block
                  italic
                  font-normal
                  text-gray-500
                  mt-3
                ">
                  Barber
                </span>

              </h1>


              <div className="
                home-fade-up
                h-px
                bg-black/15
                my-9
                max-w-md
                mx-auto
                lg:mx-0
              " />


              <p className="
                home-fade-up
                max-w-xl
                mx-auto
                lg:mx-0
                text-sm
                md:text-base
                leading-8
                text-gray-500
              ">
                Un espace dédié à l'élégance masculine,
                où chaque détail est pensé pour offrir
                une expérience unique.
              </p>


              <div className="
                home-fade-up
                mt-10
                flex
                flex-col
                sm:flex-row
                items-center
                justify-center
                lg:justify-start
                gap-4
              ">

                <a
                  href="/reservation"
                  className="
                    home-button
                    home-shimmer
                    inline-flex
                    items-center
                    justify-center
                    bg-black
                    text-white
                    px-10
                    py-5
                    rounded-full
                    tracking-[0.15em]
                    uppercase
                    text-[10px]
                    font-medium
                  "
                >
                  Réserver votre rendez-vous
                </a>


                <a
                  href="#philosophie"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-8
                    py-5
                    rounded-full
                    border
                    border-gray-200
                    text-gray-500
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    transition-all
                    duration-500
                    hover:border-black
                    hover:text-black
                    hover:bg-white
                  "
                >
                  Découvrir
                </a>

              </div>

            </div>


            {/* BLOC VISUEL */}

            <div className="
              home-scale
              hidden
              lg:flex
              justify-center
              items-center
            ">

              <div className="
                relative
                w-[390px]
                h-[520px]
              ">

                <div className="
                  absolute
                  inset-0
                  rounded-[3rem]
                  border
                  border-gray-200
                  rotate-6
                " />


                <div className="
                  absolute
                  inset-0
                  rounded-[3rem]
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                  shadow-[0_40px_100px_rgba(0,0,0,.18)]
                ">

                  <div className="
                    absolute
                    top-[-80px]
                    right-[-80px]
                    h-64
                    w-64
                    rounded-full
                    border
                    border-white/10
                  " />

                  <div className="
                    absolute
                    bottom-[-100px]
                    left-[-100px]
                    h-72
                    w-72
                    rounded-full
                    border
                    border-white/10
                  " />


                  <div className="
                    relative
                    z-10
                    text-center
                    home-float
                  ">

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.5em]
                      text-gray-500
                      mb-6
                    ">
                      VDO
                    </p>

                    <p className="
                      font-serif
                      text-7xl
                      italic
                    ">
                      Barber
                    </p>

                    <div className="
                      h-px
                      w-16
                      bg-white/30
                      mx-auto
                      my-7
                    " />

                    <p className="
                      text-[9px]
                      uppercase
                      tracking-[0.4em]
                      text-gray-500
                    ">
                      Experience
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            hidden
            md:flex
            flex-col
            items-center
            gap-3
            text-gray-400
          ">

            <span className="
              text-[8px]
              uppercase
              tracking-[0.4em]
            ">
              Scroll
            </span>

            <div className="
              h-10
              w-px
              bg-gradient-to-b
              from-black
              to-transparent
            " />

          </div>

        </div>

      </section>


      {/* PHILOSOPHIE */}

      <section
        id="philosophie"
        className="
          relative
          px-5
          md:px-10
          py-24
          md:py-36
          bg-white
        "
      >

        <div className="
          max-w-6xl
          mx-auto
        ">

          <div className="
            grid
            lg:grid-cols-[.7fr_1.3fr]
            gap-14
            lg:gap-24
            items-center
          ">


            <div className="
              home-fade-up
            ">

              <div className="
                flex
                items-center
                gap-4
                mb-7
              ">

                <span className="
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-gray-400
                ">
                  01
                </span>

                <div className="
                  h-px
                  w-10
                  bg-black
                " />

              </div>


              <p className="
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-gray-400
                mb-4
              ">
                Notre philosophie
              </p>


              <h2 className="
                font-serif
                text-5xl
                md:text-6xl
                leading-none
              ">

                L'art

                <span className="
                  block
                  italic
                  font-normal
                  text-gray-500
                ">
                  du détail
                </span>

              </h2>

            </div>


            <div className="
              home-scale
            ">

              <div className="
                border-l
                border-black
                pl-7
                md:pl-10
              ">

                <p className="
                  text-lg
                  md:text-xl
                  leading-9
                  text-gray-600
                ">
                  Chez VDO Barber, chaque prestation est réalisée
                  avec précision et exigence. Notre objectif :
                  proposer une expérience masculine élégante
                  dans un environnement moderne et raffiné.
                </p>

              </div>


              <div className="
                mt-12
                flex
                items-center
                gap-6
              ">

                <div className="
                  h-px
                  w-16
                  bg-black
                " />

                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-gray-400
                ">
                  Précision · Style · Excellence
                </p>

              </div>

            </div>

          </div>


          <div className="
            mt-24
            grid
            grid-cols-2
            md:grid-cols-4
            gap-5
          ">

            <div className="
              home-word
              border
              border-gray-100
              rounded-3xl
              p-7
              md:p-9
              bg-[#FAFAF8]
            ">

              <p className="
                font-serif
                text-4xl
                md:text-5xl
              ">
                VDO
              </p>

              <p className="
                mt-3
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Identité
              </p>

            </div>


            <div className="
              home-word
              border
              border-gray-100
              rounded-3xl
              p-7
              md:p-9
              bg-black
              text-white
              md:translate-y-8
            ">

              <p className="
                font-serif
                text-4xl
                md:text-5xl
              ">
                Barber
              </p>

              <p className="
                mt-3
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-gray-500
              ">
                Savoir-faire
              </p>

            </div>


            <div className="
              hidden
              md:block
              border
              border-gray-100
              rounded-3xl
              p-9
              bg-[#FAFAF8]
            ">

              <p className="
                font-serif
                text-5xl
              ">
                01
              </p>

              <p className="
                mt-3
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Vision
              </p>

            </div>


            <div className="
              hidden
              md:block
              border
              border-gray-100
              rounded-3xl
              p-9
              bg-[#FAFAF8]
              md:translate-y-8
            ">

              <p className="
                font-serif
                text-5xl
              ">
                ∞
              </p>

              <p className="
                mt-3
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Passion
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* SERVICES */}

      <section className="
        relative
        px-5
        md:px-10
        py-24
        md:py-36
        bg-[#FAFAF8]
      ">

        <div className="
          max-w-6xl
          mx-auto
        ">


          <div className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-8
            mb-14
          ">

            <div>

              <div className="
                flex
                items-center
                gap-4
                mb-7
              ">

                <span className="
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-gray-400
                ">
                  02
                </span>

                <div className="
                  h-px
                  w-10
                  bg-black
                " />

              </div>


              <p className="
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-gray-400
                mb-4
              ">
                Prestations
              </p>


              <h2 className="
                font-serif
                text-5xl
                md:text-6xl
                leading-none
              ">

                Nos

                <span className="
                  italic
                  font-normal
                  text-gray-500
                ">
                  services
                </span>

              </h2>

            </div>


            <p className="
              max-w-sm
              text-sm
              leading-7
              text-gray-400
              md:text-right
            ">
              Des prestations pensées pour révéler
              votre style et mettre chaque détail
              en valeur.
            </p>

          </div>


          <div className="
            grid
            md:grid-cols-3
            gap-5
          ">


            {/* COUPE */}

            <div className="
              home-service-card
              group
              relative
              bg-white
              border
              border-gray-100
              rounded-[2rem]
              p-7
              md:p-9
              min-h-[330px]
              flex
              flex-col
            ">

              <div className="
                home-service-number
                h-11
                w-11
                rounded-full
                bg-[#FAFAF8]
                border
                border-gray-100
                flex
                items-center
                justify-center
                text-[10px]
                font-medium
                mb-10
              ">
                01
              </div>


              <div className="
                mt-auto
              ">

                <h3 className="
                  font-serif
                  text-3xl
                  mb-4
                ">
                  Coupe
                </h3>


                <p className="
                  text-sm
                  leading-7
                  text-gray-400
                ">
                  Une coupe personnalisée adaptée à votre style,
                  avec un travail précis des longueurs, des volumes
                  et des finitions pour un résultat soigné.
                </p>

              </div>


              <div className="
                absolute
                bottom-7
                right-7
                opacity-0
                group-hover:opacity-100
                translate-x-3
                group-hover:translate-x-0
                transition-all
                duration-500
              ">
                <span className="text-xl">
                  ↗
                </span>
              </div>

            </div>


            {/* COUPE BARBE */}

            <div className="
              home-service-card
              group
              relative
              bg-black
              text-white
              border
              border-black
              rounded-[2rem]
              p-7
              md:p-9
              min-h-[330px]
              flex
              flex-col
              md:translate-y-8
            ">

              <div className="
                home-service-number
                h-11
                w-11
                rounded-full
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
                text-[10px]
                font-medium
                mb-10
              ">
                02
              </div>


              <div className="
                mt-auto
              ">

                <h3 className="
                  font-serif
                  text-3xl
                  mb-4
                ">
                  Coupe + Barbe
                </h3>


                <p className="
                  text-sm
                  leading-7
                  text-gray-500
                ">
                  Une prestation complète pour harmoniser la coupe
                  de cheveux et la barbe, avec un travail précis des
                  longueurs, des volumes et des contours pour un style soigné.
                </p>

              </div>


              <div className="
                absolute
                bottom-7
                right-7
                opacity-0
                group-hover:opacity-100
                translate-x-3
                group-hover:translate-x-0
                transition-all
                duration-500
              ">
                <span className="text-xl">
                  ↗
                </span>
              </div>

            </div>


            {/* TRANSFORMATION */}

            <div className="
              home-service-card
              group
              relative
              bg-white
              border
              border-gray-100
              rounded-[2rem]
              p-7
              md:p-9
              min-h-[330px]
              flex
              flex-col
            ">

              <div className="
                home-service-number
                h-11
                w-11
                rounded-full
                bg-[#FAFAF8]
                border
                border-gray-100
                flex
                items-center
                justify-center
                text-[10px]
                font-medium
                mb-10
              ">
                03
              </div>


              <div className="
                mt-auto
              ">

                <h3 className="
                  font-serif
                  text-3xl
                  mb-4
                ">
                  Coupe Transformation
                </h3>


                <p className="
                  text-sm
                  leading-7
                  text-gray-400
                ">
                  C’est une coupe réalisée après environ 2 mois de pousse
                  pour pouvoir restructurer la chevelure. Elle permet de
                  modifier la forme, la longueur et le volume afin de créer
                  un nouveau style.
                </p>

              </div>


              <div className="
                absolute
                bottom-7
                right-7
                opacity-0
                group-hover:opacity-100
                translate-x-3
                group-hover:translate-x-0
                transition-all
                duration-500
              ">
                <span className="text-xl">
                  ↗
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="
        relative
        px-5
        md:px-10
        py-24
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
          h-[500px]
          w-[500px]
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
          h-[700px]
          w-[700px]
          rounded-full
          border
          border-white/[0.035]
        " />


        <div className="
          relative
          z-10
          max-w-4xl
          mx-auto
          text-center
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

            Prenez rendez-vous

            <span className="
              block
              italic
              font-normal
              text-gray-500
              mt-4
            ">
              chez VDO Barber
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
            Réservez votre expérience premium en quelques secondes.
          </p>


          <a
            href="/reservation"
            className="
              home-button
              home-shimmer
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
            "
          >
            Réserver
          </a>

        </div>

      </section>


      {/* FOOTER */}

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

export default Home