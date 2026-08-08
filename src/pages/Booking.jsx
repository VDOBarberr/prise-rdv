import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function Booking() {

  const [availability, setAvailability] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showServices, setShowServices] = useState(false)
  const [loading, setLoading] = useState(false)

  const [confirmed, setConfirmed] = useState(false)

  const [confirmationData, setConfirmationData] = useState(null)

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

    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: true })
      .order("time", { ascending: true })

    if (error) {
      console.error(
        "Erreur chargement disponibilités :",
        error
      )
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

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.service
    ) {
      setMessage("Veuillez remplir tous les champs.")
      return
    }

    setLoading(true)

    try {

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
          "Impossible de vérifier ce créneau."
        )

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
          "Ce créneau vient d'être réservé."
        )

        return
      }

      const appointmentData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        date: currentSlot.date,
        time: currentSlot.time,
        status: "en attente"
      }

      const {
        error: appointmentError
      } = await supabase
        .from("appointments")
        .insert(appointmentData)

      if (appointmentError) {

        console.error(
          "Erreur création rendez-vous :",
          appointmentError
        )

        setMessage(
          "Une erreur est survenue lors de la réservation."
        )

        return
      }

      /*
       * IMPORTANT
       *
       * À partir d'ici, Supabase a bien enregistré
       * le rendez-vous.
       *
       * On sauvegarde les informations AVANT
       * de vider les champs.
       */

      const newConfirmation = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        date: currentSlot.date,
        time: currentSlot.time
      }

      setConfirmationData(newConfirmation)

      /*
       * C'est cette ligne qui affiche
       * l'écran de confirmation.
       */

      setConfirmed(true)

      /*
       * On désactive le créneau.
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

      }

      if (!updatedSlot) {

        console.warn(
          "Le rendez-vous est enregistré mais le créneau n'a pas été désactivé."
        )

      }

      setAvailability((prev) =>
        prev.filter(
          (slot) => slot.id !== currentSlot.id
        )
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

  /*
   * ÉCRAN DE CONFIRMATION
   */

  if (confirmed && confirmationData) {

    return (
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-20">

        <div className="text-center mb-16">

          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-5">
            VDO BARBER
          </p>

          <h1 className="font-serif text-5xl md:text-7xl leading-none">

            Rendez-vous

            <span className="block italic font-normal">
              confirmé
            </span>

          </h1>

          <p className="max-w-xl mx-auto mt-7 text-sm md:text-base leading-7 text-gray-500">
            Merci pour votre réservation.
            <br />
            Votre rendez-vous a bien été enregistré.
          </p>

        </div>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_70px_rgba(0,0,0,.06)] p-7 md:p-10">

          <div className="bg-black text-white rounded-[2rem] p-8 md:p-10">

            <div className="flex justify-center mb-8">

              <div className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center text-3xl">
                ✓
              </div>

            </div>

            <div className="text-center mb-10">

              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-500 mb-3">
                Réservation confirmée
              </p>

              <h2 className="font-serif text-3xl md:text-4xl">
                Votre rendez-vous est confirmé
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-white/5 rounded-2xl p-5">

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Nom
                </p>

                <p className="font-serif text-xl">
                  {confirmationData.name}
                </p>

              </div>

              <div className="bg-white/5 rounded-2xl p-5">

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Prestation
                </p>

                <p className="font-serif text-xl">
                  {confirmationData.service}
                </p>

              </div>

              <div className="bg-white/5 rounded-2xl p-5">

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Date
                </p>

                <p className="font-serif text-xl">
                  {confirmationData.date}
                </p>

              </div>

              <div className="bg-white/5 rounded-2xl p-5">

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Heure
                </p>

                <p className="font-serif text-xl">
                  {confirmationData.time}
                </p>

              </div>

            </div>

            <div className="text-center mt-10 pt-8 border-t border-white/10">

              <p className="text-sm text-gray-400">
                Merci {confirmationData.name}
              </p>

              <p className="font-serif text-xl mt-2">
                À bientôt au VDO BARBER
              </p>

            </div>

          </div>

        </section>

      </div>
    )
  }

  /*
   * PAGE DE RÉSERVATION
   */

  return (

    <div className="max-w-5xl mx-auto px-5 md:px-10 py-20">

      <div className="text-center mb-16">

        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-5">
          VDO BARBER
        </p>

        <h1 className="font-serif text-5xl md:text-7xl leading-none">

          Prendre

          <span className="block italic font-normal">
            rendez-vous
          </span>

        </h1>

        <p className="max-w-xl mx-auto mt-7 text-sm md:text-base leading-7 text-gray-500">
          Choisissez votre date, votre horaire et votre prestation.
          <br />
          Votre expérience commence ici.
        </p>

      </div>

      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_70px_rgba(0,0,0,.05)] p-7 md:p-10 mb-7">

        <div className="flex items-start gap-5 mb-8">

          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-xs">
            01
          </div>

          <div>

            <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-2">
              Première étape
            </p>

            <h2 className="font-serif text-3xl md:text-4xl">
              Choisir une date
            </h2>

            <p className="text-sm text-gray-400 mt-2">
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
          className="w-full bg-[#FAFAF8] border border-gray-200 p-5 md:p-6 rounded-2xl text-black text-base outline-none transition-all duration-500 hover:border-gray-400 focus:border-black focus:bg-white"
        />

      </section>

      {selectedDate && (

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_70px_rgba(0,0,0,.05)] p-7 md:p-10 mb-7 dropdown-animation">

          <div className="flex items-start gap-5 mb-8">

            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-xs">
              02
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-2">
                Deuxième étape
              </p>

              <h2 className="font-serif text-3xl md:text-4xl">
                Choisir votre horaire
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Disponibilités pour le {selectedDate}
              </p>

            </div>

          </div>

          {availableSlots.length > 0 ? (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {availableSlots.map((slot, index) => (

                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {

                    setSelectedSlot(slot)
                    setMessage("")

                  }}
                  style={{
                    animationDelay: `${index * 70}ms`
                  }}
                  className={`booking-slot relative p-5 md:p-6 rounded-2xl border font-medium text-sm md:text-base overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] animate-service ${
                    selectedSlot?.id === slot.id
                      ? "bg-black text-white border-black scale-[1.03] shadow-[0_15px_45px_rgba(0,0,0,.20)]"
                      : "bg-[#FAFAF8] text-black border-gray-200 hover:border-black hover:bg-white hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,.10)]"
                  }`}
                >

                  {slot.time}

                  {selectedSlot?.id === slot.id && (

                    <span className="block text-[8px] uppercase tracking-[0.25em] text-white/60 mt-2">
                      Sélectionné
                    </span>

                  )}

                </button>

              ))}

            </div>

          ) : (

            <div className="py-8 text-center">

              <p className="text-gray-400">
                Aucun créneau disponible pour cette date.
              </p>

            </div>

          )}

        </section>

      )}

      {selectedSlot && (

        <section className="relative z-30 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_70px_rgba(0,0,0,.06)] p-7 md:p-10 dropdown-animation">

          <div className="flex items-start gap-5 mb-8">

            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center text-xs">
              03
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-2">
                Dernière étape
              </p>

              <h2 className="font-serif text-3xl md:text-4xl">
                Votre réservation
              </h2>

            </div>

          </div>

          <div className="bg-black text-white rounded-3xl p-6 md:p-7 mb-8">

            <p className="text-[9px] uppercase tracking-[0.35em] text-gray-500 mb-5">
              Votre créneau
            </p>

            <div className="grid md:grid-cols-3 gap-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Date
                </p>

                <p className="font-serif text-xl">
                  {selectedSlot.date}
                </p>

              </div>

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Heure
                </p>

                <p className="font-serif text-xl">
                  {selectedSlot.time}
                </p>

              </div>

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Prestation
                </p>

                <p className="font-serif text-xl">
                  {form.service || "À sélectionner"}
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={createAppointment}
            className="space-y-5"
          >

            <div>

              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                Nom
              </label>

              <input
                type="text"
                className="booking-input w-full bg-[#FAFAF8] border border-gray-200 p-4 rounded-xl text-black outline-none transition-all duration-500 hover:border-gray-400 focus:border-black"
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

            <div>

              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                Téléphone
              </label>

              <input
                type="tel"
                className="booking-input w-full bg-[#FAFAF8] border border-gray-200 p-4 rounded-xl text-black outline-none transition-all duration-500 hover:border-gray-400 focus:border-black"
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

            <div>

              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                Email
              </label>

              <input
                type="email"
                className="booking-input w-full bg-[#FAFAF8] border border-gray-200 p-4 rounded-xl text-black outline-none transition-all duration-500 hover:border-gray-400 focus:border-black"
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

            <div className="relative z-[100]">

              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                Prestation
              </label>

              <button
                type="button"
                onClick={() =>
                  setShowServices(!showServices)
                }
                className={`relative z-20 w-full bg-[#FAFAF8] border p-5 rounded-xl text-left transition-all duration-500 ${
                  showServices
                    ? "border-black shadow-[0_10px_35px_rgba(0,0,0,.08)] bg-white"
                    : "border-gray-200 hover:border-black hover:bg-white"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <span
                      className={
                        form.service
                          ? "text-black"
                          : "text-gray-400"
                      }
                    >
                      {form.service ||
                        "Choisir une prestation"}
                    </span>

                    {form.service && (

                      <span className="block text-[8px] uppercase tracking-[0.2em] text-gray-400 mt-1">
                        Prestation sélectionnée
                      </span>

                    )}

                  </div>

                  <span
                    className={`text-lg transition-transform duration-500 ${
                      showServices
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  >
                    ⌄
                  </span>

                </div>

              </button>

              {showServices && (

                <div className="relative w-full mt-3 bg-black text-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,.30)] border border-gray-800 overflow-visible dropdown-premium">

                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />

                  {services.map((service, index) => (

                    <button
                      key={service.name}
                      type="button"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                      onClick={() => {

                        setForm({
                          ...form,
                          service: `${service.name} - ${service.price}`
                        })

                        setShowServices(false)

                      }}
                      className="booking-service group relative block w-full p-5 md:p-6 text-left border-b border-white/10 last:border-none transition-all duration-500 hover:bg-white hover:text-black hover:px-7 animate-service"
                    >

                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white scale-y-0 origin-center transition-transform duration-500 group-hover:scale-y-100 group-hover:bg-black" />

                      <div className="flex justify-between items-center gap-5">

                        <div className="flex items-center gap-4 min-w-0">

                          <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-[9px] text-gray-400 transition-all duration-500 group-hover:bg-black group-hover:text-white group-hover:scale-110">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <p className="font-serif text-lg md:text-xl transition-all duration-500 group-hover:translate-x-1">
                            {service.name}
                          </p>

                        </div>

                        <p className="flex-shrink-0 font-bold text-sm md:text-base">
                          {service.price}
                        </p>

                      </div>

                      <p className="text-sm text-gray-400 mt-3 ml-13 transition-colors duration-500 group-hover:text-gray-600">
                        {service.description}
                      </p>

                      <div className="mt-4 h-px w-0 bg-current transition-all duration-700 group-hover:w-full opacity-20" />

                    </button>

                  ))}

                </div>

              )}

            </div>

            {message && (

              <div className="rounded-2xl p-4 text-sm text-center bg-[#FAFAF8] border border-gray-200 text-gray-600">

                {message}

              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-full uppercase tracking-[0.28em] text-[10px] md:text-xs font-medium transition-all duration-500 hover:bg-gray-800 hover:scale-[1.015] hover:shadow-[0_20px_45px_rgba(0,0,0,.18)] active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading
                ? "Réservation en cours..."
                : "Confirmer le rendez-vous"}

            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {

                setSelectedSlot(null)
                setMessage("")
                setShowServices(false)

              }}
              className="w-full border border-gray-200 text-gray-500 py-4 rounded-full text-[10px] uppercase tracking-[0.25em] transition-all duration-500 hover:border-black hover:text-black hover:bg-[#FAFAF8]"
            >

              Changer d'horaire

            </button>

          </form>

        </section>

      )}

      <style>{`

        @keyframes dropdownReveal {

          0% {
            opacity: 0;
            transform: translateY(-15px) scale(.97);
            filter: blur(6px);
          }

          50% {
            opacity: .8;
            filter: blur(2px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

        }

        @keyframes serviceReveal {

          0% {
            opacity: 0;
            transform: translateX(-25px);
          }

          60% {
            opacity: 1;
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }

        }

        @keyframes dropdownGlow {

          0% {
            box-shadow:
              0 0 0 rgba(0,0,0,0);
          }

          100% {
            box-shadow:
              0 30px 100px rgba(0,0,0,.30);
          }

        }

        .dropdown-animation {

          animation:
            dropdownReveal
            .55s
            cubic-bezier(.22,1,.36,1)
            both;

        }

        .dropdown-premium {

          animation:
            dropdownReveal
            .55s
            cubic-bezier(.22,1,.36,1)
            both,
            dropdownGlow
            .7s
            ease
            both;

        }

        .animate-service {

          animation:
            serviceReveal
            .65s
            cubic-bezier(.22,1,.36,1)
            both;

        }

        .booking-service:hover {

          box-shadow:
            inset 4px 0 0 currentColor;

        }

        .booking-slot::after {

          content: "";

          position: absolute;

          inset: 0;

          pointer-events: none;

          opacity: 0;

          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(255,255,255,.35) 50%,
              transparent 75%
            );

          transform:
            translateX(-100%);

        }

        .booking-slot:hover::after {

          opacity: 1;

          animation:
            slotShimmer
            1s
            ease;

        }

        @keyframes slotShimmer {

          0% {
            transform:
              translateX(-100%);
          }

          100% {
            transform:
              translateX(100%);
          }

        }

        @media (max-width: 640px) {

          .booking-service {

            padding-top: 18px;
            padding-bottom: 18px;

          }

          .booking-service p {

            word-break: normal;

          }

        }

      `}</style>

    </div>
  )
}

export default Booking