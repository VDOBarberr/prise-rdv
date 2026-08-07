import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function Booking() {

  const [availability, setAvailability] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showServices, setShowServices] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: ""
  })


  const services = [
    {
      name: "Coupe",
      price: "15€",
      description: "Coupe homme personnalisée"
    },
    {
      name: "Coupe + barbe",
      price: "20€",
      description: "Coupe complète avec taille de barbe"
    },
    {
      name: "Coupe Transformation",
      price: "20€",
      description: "+ de 2 mois de pousse"
    }
  ]


  async function loadAvailability() {

    const {
      data,
      error
    } = await supabase
      .from("availability")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: true })
      .order("time", { ascending: true })


    if (error) {
      console.error("Erreur chargement disponibilités :", error)
      return
    }


    setAvailability(data || [])
  }


  useEffect(() => {
    loadAvailability()
  }, [])


  const availableSlots = availability.filter(
    (slot) => slot.date === selectedDate
  )


  async function createAppointment(e) {

    e.preventDefault()

    setMessage("")


    if (!selectedSlot) {
      setMessage("Veuillez sélectionner un créneau.")
      return
    }


    if (!form.name || !form.phone || !form.email || !form.service) {
      setMessage("Veuillez remplir tous les champs.")
      return
    }


    setLoading(true)


    try {

      /*
       * 1. Vérification de sécurité :
       * on vérifie que le créneau est toujours disponible
       * directement dans Supabase.
       */

      const {
        data: currentSlot,
        error: checkError
      } = await supabase
        .from("availability")
        .select("*")
        .eq("id", selectedSlot.id)
        .eq("active", true)
        .maybeSingle()


      if (checkError) {
        console.error(
          "Erreur vérification créneau :",
          checkError
        )

        setMessage(
          "Impossible de vérifier ce créneau. Veuillez réessayer."
        )

        setLoading(false)
        return
      }


      if (!currentSlot) {

        setAvailability((prev) =>
          prev.filter(
            (slot) => slot.id !== selectedSlot.id
          )
        )

        setSelectedSlot(null)

        setMessage(
          "Ce créneau vient malheureusement d'être réservé."
        )

        setLoading(false)
        return
      }


      /*
       * 2. Création du rendez-vous
       */

      const {
        error: appointmentError
      } = await supabase
        .from("appointments")
        .insert({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.service,
          date: currentSlot.date,
          time: currentSlot.time,
          status: "en attente"
        })


      if (appointmentError) {

        console.error(
          "Erreur création rendez-vous :",
          appointmentError
        )

        setMessage(
          "Une erreur est survenue lors de la réservation."
        )

        setLoading(false)
        return
      }


      /*
       * 3. Désactivation du créneau
       */

      const {
        data: updatedSlot,
        error: availabilityError
      } = await supabase
        .from("availability")
        .update({
          active: false
        })
        .eq("id", currentSlot.id)
        .eq("active", true)
        .select()
        .maybeSingle()


      if (availabilityError) {

        console.error(
          "Erreur désactivation créneau :",
          availabilityError
        )

        setMessage(
          "Le rendez-vous a été créé, mais le créneau n'a pas pu être désactivé."
        )

        setLoading(false)
        return
      }


      /*
       * 4. Vérification importante :
       * Supabase peut parfois retourner aucune ligne
       * lorsque les permissions RLS empêchent la modification.
       */

      if (!updatedSlot) {

        console.error(
          "Le créneau n'a pas été modifié. Vérifiez les politiques RLS de Supabase."
        )

        setMessage(
          "Le rendez-vous a été créé, mais les disponibilités nécessitent une configuration Supabase."
        )

        setLoading(false)
        return
      }


      /*
       * 5. Suppression immédiate du créneau dans l'interface
       */

      setAvailability((prev) =>
        prev.filter(
          (slot) => slot.id !== currentSlot.id
        )
      )


      /*
       * 6. Nettoyage de l'interface
       */

      setSelectedSlot(null)
      setSelectedDate("")
      setShowServices(false)

      setForm({
        name: "",
        phone: "",
        email: "",
        service: ""
      })


      setMessage(
        "Votre rendez-vous est enregistré."
      )


    } catch (error) {

      console.error(
        "Erreur inattendue :",
        error
      )

      setMessage(
        "Une erreur inattendue est survenue."
      )

    } finally {

      setLoading(false)

    }
  }


  return (

    <div className="
      min-h-screen
      bg-[#FAFAF8]
      text-black
      overflow-hidden
      relative
    ">


      {/* ARRIÈRE-PLAN */}

      <div className="
        pointer-events-none
        absolute
        top-[-200px]
        left-1/2
        -translate-x-1/2
        h-[600px]
        w-[600px]
        rounded-full
        bg-black/[0.025]
        blur-[140px]
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


      {/* HEADER */}

      <section className="
        relative
        z-10
        px-5
        md:px-10
        pt-24
        pb-16
      ">

        <div className="
          max-w-5xl
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
              bg-black
            " />

            <span className="
              text-[9px]
              uppercase
              tracking-[0.45em]
              text-gray-400
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
            text-6xl
            md:text-8xl
            leading-[.85]
            tracking-[-0.05em]
          ">

            Prendre

            <span className="
              block
              italic
              font-normal
              text-gray-500
              mt-3
            ">
              rendez-vous
            </span>

          </h1>


          <p className="
            max-w-xl
            mx-auto
            mt-8
            text-sm
            md:text-base
            leading-8
            text-gray-500
          ">
            Choisissez votre date, votre horaire
            et votre prestation.
            <br />
            Votre expérience commence ici.
          </p>

        </div>

      </section>


      {/* CONTENU */}

      <main className="
        relative
        z-10
        max-w-5xl
        mx-auto
        px-5
        md:px-10
        pb-32
      ">


        {/* ÉTAPE 1 */}

        <section className="
          bg-white
          rounded-[2.5rem]
          border
          border-gray-100
          shadow-[0_20px_70px_rgba(0,0,0,.05)]
          p-7
          md:p-10
          mb-7
        ">


          <div className="
            flex
            items-start
            gap-5
            mb-8
          ">

            <div className="
              flex-shrink-0
              h-12
              w-12
              rounded-full
              bg-black
              text-white
              flex
              items-center
              justify-center
              text-xs
            ">
              01
            </div>


            <div>

              <p className="
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-gray-400
                mb-2
              ">
                Première étape
              </p>

              <h2 className="
                font-serif
                text-3xl
                md:text-4xl
              ">
                Choisir une date
              </h2>

              <p className="
                text-sm
                text-gray-400
                mt-2
              ">
                Disponibilités en temps réel
              </p>

            </div>

          </div>


          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {

              setSelectedDate(e.target.value)
              setSelectedSlot(null)
              setMessage("")

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

        </section>


        {/* ÉTAPE 2 */}

        {selectedDate && (

          <section className="
            bg-white
            rounded-[2.5rem]
            border
            border-gray-100
            shadow-[0_20px_70px_rgba(0,0,0,.05)]
            p-7
            md:p-10
            mb-7
            animate-[fadeUp_.6s_ease]
          ">


            <div className="
              flex
              items-start
              gap-5
              mb-8
            ">

              <div className="
                flex-shrink-0
                h-12
                w-12
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-xs
              ">
                02
              </div>


              <div>

                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-gray-400
                  mb-2
                ">
                  Deuxième étape
                </p>

                <h2 className="
                  font-serif
                  text-3xl
                  md:text-4xl
                ">
                  Choisir votre horaire
                </h2>

                <p className="
                  text-sm
                  text-gray-400
                  mt-2
                ">
                  Disponibilités pour le {selectedDate}
                </p>

              </div>

            </div>


            {availableSlots.length > 0 ? (

              <div className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-4
              ">

                {availableSlots.map((slot, index) => (

                  <button
                    key={slot.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setSelectedSlot(slot)
                      setMessage("")
                    }}
                    style={{
                      animationDelay: `${index * 70}ms`
                    }}
                    className={`
                      booking-slot
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
                          ? "bg-black text-white border-black scale-[1.03] shadow-[0_15px_45px_rgba(0,0,0,.20)]"
                          : "bg-[#FAFAF8] text-black border-gray-200 hover:border-black hover:bg-white hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,.10)]"
                      }
                    `}
                  >

                    {slot.time}


                    {selectedSlot?.id === slot.id && (

                      <span className="
                        block
                        text-[8px]
                        uppercase
                        tracking-[0.25em]
                        text-gray-400
                        mt-2
                      ">
                        Sélectionné
                      </span>

                    )}

                  </button>

                ))}

              </div>

            ) : (

              <div className="
                py-10
                text-center
              ">

                <p className="
                  font-serif
                  text-2xl
                  mb-3
                ">
                  Aucun créneau disponible
                </p>

                <p className="
                  text-sm
                  text-gray-400
                ">
                  Veuillez sélectionner une autre date.
                </p>

              </div>

            )}

          </section>

        )}


        {/* ÉTAPE 3 */}

        {selectedSlot && (

          <section className="
            bg-white
            rounded-[2.5rem]
            border
            border-gray-100
            shadow-[0_20px_70px_rgba(0,0,0,.06)]
            p-7
            md:p-10
            animate-[fadeUp_.6s_ease]
          ">


            <div className="
              flex
              items-start
              gap-5
              mb-8
            ">

              <div className="
                flex-shrink-0
                h-12
                w-12
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                text-xs
              ">
                03
              </div>


              <div>

                <p className="
                  text-[9px]
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


            {/* RÉCAPITULATIF */}

            <div className="
              bg-black
              text-white
              rounded-3xl
              p-6
              md:p-7
              mb-8
            ">

              <p className="
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-gray-500
                mb-5
              ">
                Votre créneau
              </p>


              <div className="
                grid
                md:grid-cols-3
                gap-5
              ">

                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-gray-500
                    mb-2
                  ">
                    Date
                  </p>

                  <p className="
                    font-serif
                    text-xl
                  ">
                    {selectedSlot.date}
                  </p>

                </div>


                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-gray-500
                    mb-2
                  ">
                    Heure
                  </p>

                  <p className="
                    font-serif
                    text-xl
                  ">
                    {selectedSlot.time}
                  </p>

                </div>


                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-gray-500
                    mb-2
                  ">
                    Prestation
                  </p>

                  <p className="
                    font-serif
                    text-xl
                  ">
                    {form.service || "À sélectionner"}
                  </p>

                </div>

              </div>

            </div>


            <form
              onSubmit={createAppointment}
              className="
                space-y-6
              "
            >


              {/* NOM */}

              <div>

                <label className="
                  block
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-gray-400
                  mb-3
                ">
                  Nom
                </label>

                <input
                  type="text"
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
                    focus:bg-white
                  "
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                />

              </div>


              {/* TÉLÉPHONE */}

              <div>

                <label className="
                  block
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-gray-400
                  mb-3
                ">
                  Téléphone
                </label>

                <input
                  type="tel"
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
                    focus:bg-white
                  "
                  placeholder="Votre téléphone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="
                  block
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-gray-400
                  mb-3
                ">
                  Email
                </label>

                <input
                  type="email"
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
                    focus:bg-white
                  "
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />

              </div>


              {/* PRESTATION */}

              <div className="
                relative
              ">

                <label className="
                  block
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-gray-400
                  mb-3
                ">
                  Prestation
                </label>


                <button
                  type="button"
                  onClick={() =>
                    setShowServices(!showServices)
                  }
                  className={`
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
                    ${
                      form.service
                        ? "text-black"
                        : "text-gray-400"
                    }
                  `}
                >

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">

                    <span>
                      {form.service
                        ? form.service
                        : "Choisir une prestation"}
                    </span>


                    <span
                      className={`
                        text-lg
                        transition-transform
                        duration-300
                        ${
                          showServices
                            ? "rotate-180"
                            : "rotate-0"
                        }
                      `}
                    >
                      ⌄
                    </span>

                  </div>

                </button>


                {showServices && (

                  <div className="
                    absolute
                    z-[100]
                    left-0
                    right-0
                    top-full
                    mt-3
                    bg-white
                    border
                    border-gray-100
                    rounded-2xl
                    shadow-[0_25px_70px_rgba(0,0,0,.15)]
                    p-2
                    overflow-hidden
                  ">

                    {services.map((service, index) => (

                      <button
                        key={service.name}
                        type="button"
                        style={{
                          animationDelay: `${index * 80}ms`
                        }}
                        onClick={() => {

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
                          duration-300
                          hover:bg-[#FAFAF8]
                          hover:translate-x-1
                        "
                      >

                        <div className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        ">

                          <p className="
                            font-serif
                            text-lg
                          ">
                            {service.name}
                          </p>


                          <p className="
                            font-medium
                          ">
                            {service.price}
                          </p>

                        </div>


                        <p className="
                          text-xs
                          text-gray-400
                          mt-2
                        ">
                          {service.description}
                        </p>

                      </button>

                    ))}

                  </div>

                )}

              </div>


              {/* MESSAGE */}

              {message && (

                <div className={`
                  rounded-2xl
                  p-4
                  text-sm
                  text-center
                  ${
                    message.includes("enregistré")
                      ? "bg-black text-white"
                      : "bg-[#FAFAF8] border border-gray-200 text-gray-600"
                  }
                `}>

                  {message}

                </div>

              )}


              {/* CONFIRMATION */}

              <button
                type="submit"
                disabled={loading}
                className="
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
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                "
              >

                {loading
                  ? "Réservation en cours..."
                  : "Confirmer le rendez-vous"}

              </button>


              {/* CHANGER D'HORAIRE */}

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setSelectedSlot(null)
                  setMessage("")
                }}
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
                  disabled:opacity-50
                "
              >
                Changer d'horaire
              </button>


            </form>

          </section>

        )}

      </main>


      {/* SIGNATURE */}

      <footer className="
        relative
        z-10
        bg-black
        text-white
        px-5
        md:px-10
        py-10
      ">

        <div className="
          max-w-5xl
          mx-auto
          flex
          items-center
          justify-between
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
              bg-white
              text-black
              flex
              items-center
              justify-center
              font-serif
            ">
              V
            </div>


            <p className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-gray-500
            ">
              VDO BARBER — EXPERIENCE
            </p>

          </div>

        </div>

      </footer>


      <style>{`

        @keyframes fadeUp {

          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }

        }

      `}</style>

    </div>

  )
}


export default Booking