import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function Reservation() {

  const allTimes = [
    "09h00",
    "10h00",
    "11h00",
    "14h00",
    "15h00"
  ]

  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: ""
  })

  const [confirmation, setConfirmation] = useState(true)

  async function getServices() {

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)

    if (error) {
      console.log("Erreur services :", error)
      return
    }

    setServices(data || [])
  }

  useEffect(() => {

    getServices()

    const savedConfirmation =
      localStorage.getItem("vdo_barber_confirmation")

    if (savedConfirmation) {

      try {

        setConfirmation(
          JSON.parse(savedConfirmation)
        )

      } catch (error) {

        localStorage.removeItem(
          "vdo_barber_confirmation"
        )

      }

    }

  }, [])

  async function getAvailableTimes(date) {

    if (!date) {

      setAvailableTimes([])

      return
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", date)

    if (error) {

      console.log("Erreur horaires :", error)

      return
    }

    const bookedTimes = (data || []).map(
      appointment => appointment.time
    )

    const freeTimes = allTimes.filter(
      time => !bookedTimes.includes(time)
    )

    setAvailableTimes(freeTimes)

    setSelectedTime(null)
  }

  useEffect(() => {

    getAvailableTimes(selectedDate)

  }, [selectedDate])

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  async function handleSubmit(e) {

    e.preventDefault()

    if (!selectedService) {

      alert("Veuillez choisir une prestation")

      return
    }

    if (!selectedDate) {

      alert("Veuillez choisir une date")

      return
    }

    if (!selectedTime) {

      alert("Veuillez choisir un horaire")

      return
    }

    const appointment = {

      name: form.name,

      phone: form.phone,

      email: form.email,

      date: selectedDate,

      time: selectedTime,

      service: selectedService.name,

      status: "confirmé"

    }

    const { error } = await supabase
      .from("appointments")
      .insert([appointment])

    if (error) {

      console.log(
        "Erreur réservation :",
        error
      )

      alert(
        "Erreur lors de la réservation"
      )

      return
    }

    const confirmationData = {

      name: form.name,

      phone: form.phone,

      email: form.email,

      service: selectedService.name,

      date: selectedDate,

      time: selectedTime

    }

    localStorage.setItem(
      "vdo_barber_confirmation",
      JSON.stringify(confirmationData)
    )

    setConfirmation(
      confirmationData
    )

  }

  if (confirmation) {

    return (

      <div>

        <div>
          VDO BARBER
        </div>

        <div>
          modern barbering
        </div>

        <div>
          Réservez votre créneau
        </div>

        <div>
          Barber premium
        </div>

        <div
          className="
            w-full
            rounded-3xl
            p-8
            bg-black
            text-white
            shadow-xl
            mt-6
          "
        >

          <div
            className="
              w-16
              h-16
              mx-auto
              mb-6
              rounded-full
              bg-white
              text-black
              flex
              items-center
              justify-center
              text-2xl
            "
          >

            ✓

          </div>

          <div
            className="
              text-center
              text-xl
              font-medium
              mb-6
            "
          >

            Votre rendez-vous est confirmé

          </div>

          <div
            className="
              space-y-3
              text-center
              text-gray-300
            "
          >

            <div className="text-white">

              {confirmation.service}

            </div>

            <div>

              {confirmation.date}

            </div>

            <div>

              {confirmation.time}

            </div>

          </div>

          <div
            className="
              text-center
              mt-6
              pt-6
              border-t
              border-gray-700
            "
          >

            Merci {confirmation.name}

          </div>

          <div
            className="
              text-center
              mt-2
              text-gray-400
            "
          >

            À bientôt au Barber Club

          </div>

        </div>

      </div>

    )

  }

  return (

    <div>

      <div>
        VDO BARBER
      </div>

      <div>
        modern barbering
      </div>

      <div>
        Réservez votre créneau
      </div>

      <div>
        Barber premium
      </div>

      <div>
        Choisissez votre prestation
      </div>

      {services.map(service => (

        <button
          key={service.id}
          type="button"
          onClick={() =>
            setSelectedService(service)
          }
          className={`
            w-full
            rounded-3xl
            p-6
            text-left
            border
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl

            ${
              selectedService?.id === service.id
                ? "bg-black text-white border-black shadow-xl"
                : "bg-white text-black border-gray-200 hover:border-black"
            }
          `}
        >

          <div>
            {service.name}
          </div>

          <div>
            {service.duration} minutes
          </div>

          <div>
            {service.price} €
          </div>

        </button>

      ))}

      {selectedService && (

        <div>

          <div>
            Choisissez votre date
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="
              w-full
              rounded-2xl
              p-5
              border
              border-gray-200
              focus:border-black
              focus:outline-none
            "
          />

        </div>

      )}

      {selectedDate && (

        <div>

          <div>
            Horaires disponibles
          </div>

          {availableTimes.map(time => (

            <button
              key={time}
              type="button"
              onClick={() =>
                setSelectedTime(time)
              }
              className={`
                rounded-full
                py-4
                border
                transition-all
                duration-300
                hover:-translate-y-1

                ${
                  selectedTime === time
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }
              `}
            >

              {time}

            </button>

          ))}

          {availableTimes.length === 0 && (

            <div>
              Aucun créneau disponible
            </div>

          )}

        </div>

      )}

      {selectedTime && (

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >

          <div>
            Vos informations
          </div>

          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={form.name}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              p-5
              border
              border-gray-200
              focus:outline-none
              focus:border-black
              transition
            "
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              p-5
              border
              border-gray-200
              focus:outline-none
              focus:border-black
              transition
            "
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={form.email}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              p-5
              border
              border-gray-200
              focus:outline-none
              focus:border-black
              transition
            "
            required
          />

          <button
            type="submit"
            className="
              w-full
              rounded-full
              py-5
              bg-black
              text-white
              uppercase
              tracking-[0.25em]
              text-sm
              transition-all
              duration-300
              hover:bg-gray-800
              hover:-translate-y-1
              shadow-lg
            "
          >

            Confirmer mon rendez-vous

          </button>

        </form>

      )}

    </div>

  )
}

export default Reservation