import { useState } from "react"
import { supabase } from "../services/supabase"

function MesRendezVous() {

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const [appointments, setAppointments] = useState([])

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function searchAppointments(e) {

    e.preventDefault()

    setMessage("")
    setAppointments([])

    if (!name.trim() || !phone.trim()) {
      setMessage("Veuillez renseigner votre nom et votre téléphone.")
      return
    }

    setLoading(true)

    try {

      const {
        data,
        error
      } = await supabase
        .from("appointments")
        .select("*")
        .ilike("name", name.trim())
        .eq("phone", phone.trim())
        .order("date", { ascending: true })
        .order("time", { ascending: true })

      if (error) {

        console.error(
          "Erreur recherche rendez-vous :",
          error
        )

        setMessage(
          "Une erreur est survenue lors de la recherche."
        )

        return
      }

      if (!data || data.length === 0) {

        setMessage(
          "Aucun rendez-vous trouvé avec ces informations."
        )

        return
      }

      setAppointments(data)

    } catch (error) {

      console.error(error)

      setMessage(
        "Une erreur inattendue est survenue."
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="max-w-5xl mx-auto px-5 md:px-10 py-20">

      {/* HEADER */}

      <div className="text-center mb-16">

        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-5">
          VDO BARBER
        </p>

        <h1 className="font-serif text-5xl md:text-7xl leading-none">

          Mes

          <span className="block italic font-normal">
            rendez-vous
          </span>

        </h1>

        <p className="max-w-xl mx-auto mt-7 text-sm md:text-base leading-7 text-gray-500">
          Retrouvez vos rendez-vous en renseignant
          <br />
          votre nom et votre numéro de téléphone.
        </p>

      </div>


      {/* RECHERCHE */}

      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_70px_rgba(0,0,0,.05)] p-7 md:p-10 mb-8">

        <div className="flex items-start gap-5 mb-8">

          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-xs">
            01
          </div>

          <div>

            <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-2">
              Recherche
            </p>

            <h2 className="font-serif text-3xl md:text-4xl">
              Retrouver mon rendez-vous
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Utilisez les informations données lors de la réservation.
            </p>

          </div>

        </div>


        <form
          onSubmit={searchAppointments}
          className="space-y-5"
        >

          {/* NOM */}

          <div>

            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              Nom
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Votre nom"
              className="
                w-full
                bg-[#FAFAF8]
                border
                border-gray-200
                p-5
                rounded-2xl
                text-black
                outline-none
                transition-all
                duration-500
                hover:border-gray-400
                focus:border-black
                focus:bg-white
              "
            />

          </div>


          {/* TELEPHONE */}

          <div>

            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
              Téléphone
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Votre numéro de téléphone"
              className="
                w-full
                bg-[#FAFAF8]
                border
                border-gray-200
                p-5
                rounded-2xl
                text-black
                outline-none
                transition-all
                duration-500
                hover:border-gray-400
                focus:border-black
                focus:bg-white
              "
            />

          </div>


          {/* MESSAGE */}

          {message && (

            <div className="
              rounded-2xl
              p-5
              bg-[#FAFAF8]
              border
              border-gray-200
              text-gray-600
              text-sm
              text-center
            ">

              {message}

            </div>

          )}


          {/* BOUTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
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
            "
          >

            {loading
              ? "Recherche..."
              : "Retrouver mon rendez-vous"
            }

          </button>

        </form>

      </section>


      {/* RESULTATS */}

      {appointments.length > 0 && (

        <section className="
          bg-white
          rounded-[2.5rem]
          border
          border-gray-100
          shadow-[0_20px_70px_rgba(0,0,0,.05)]
          p-7
          md:p-10
        ">

          <div className="flex items-start gap-5 mb-8">

            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
              ✓
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-2">
                Rendez-vous trouvé
              </p>

              <h2 className="font-serif text-3xl md:text-4xl">
                Vos rendez-vous
              </h2>

            </div>

          </div>


          <div className="space-y-5">

            {appointments.map((appointment) => (

              <div
                key={appointment.id}
                className="
                  bg-black
                  text-white
                  rounded-3xl
                  p-6
                  md:p-7
                "
              >

                <div className="grid md:grid-cols-2 gap-5">

                  {/* DATE */}

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                      Date
                    </p>

                    <p className="font-serif text-2xl">
                      {appointment.date}
                    </p>

                  </div>


                  {/* HEURE */}

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                      Heure
                    </p>

                    <p className="font-serif text-2xl">
                      {appointment.time}
                    </p>

                  </div>


                  {/* PRESTATION */}

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                      Prestation
                    </p>

                    <p className="font-serif text-xl">
                      {appointment.service}
                    </p>

                  </div>


                  {/* STATUT */}

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                      Statut
                    </p>

                    <p className="text-sm uppercase tracking-[0.15em]">
                      {appointment.status}
                    </p>

                  </div>

                </div>


                <div className="mt-7 pt-6 border-t border-white/10">

                  <p className="text-sm text-gray-400">
                    Rendez-vous au VDO BARBER
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

      )}

    </div>

  )
}

export default MesRendezVous