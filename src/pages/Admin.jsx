import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

function Admin() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availability, setAvailability] = useState([])
  const [appointments, setAppointments] = useState([])
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)

  const daysOrder = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche"
  ]

  const times = [
    "09h00",
    "10h00",
    "11h00",
    "12h00",
    "13h00",
    "14h00",
    "15h00",
    "16h00",
    "17h00",
    "18h00"
  ]

  // CHARGEMENT DES DONNEES

  async function loadData() {
    const {
      data: availabilityData,
      error: availabilityError
    } = await supabase
      .from("availability")
      .select("*")

    if (availabilityError) {
      console.log(availabilityError)
      return
    }

    const {
      data: appointmentsData,
      error: appointmentsError
    } = await supabase
      .from("appointments")
      .select("*")

    if (appointmentsError) {
      console.log(appointmentsError)
      return
    }

    setAvailability(availabilityData || [])
    setAppointments(appointmentsData || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  // DATE DU LUNDI

  function getMonday(date) {
    const result = new Date(date)
    const day = result.getDay()

    const diff = day === 0 ? -6 : 1 - day

    result.setDate(result.getDate() + diff)

    return result
  }

  function formatDate(date) {
    const year = date.getFullYear()

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0")

    const day = String(
      date.getDate()
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  // CHANGER DE SEMAINE

  function changeWeek(value) {
    const date = new Date(currentDate)

    date.setDate(
      date.getDate() + value * 7
    )

    setCurrentDate(date)
  }

  // GENERER LES JOURS DE LA SEMAINE

  function getWeekDays() {
    const monday = getMonday(currentDate)

    return daysOrder.map((day, index) => {
      const date = new Date(monday)

      date.setDate(
        monday.getDate() + index
      )

      return {
        name: day,
        date: formatDate(date)
      }
    })
  }

  // SELECTIONNER UN JOUR

  function selectDay(day) {
    setSelectedDay(day)
  }

  // VERIFIER SI UN CRENEAU EXISTE

  function isAvailable(date, time) {
    return availability.some(
      item =>
        item.date === date &&
        item.time === time &&
        item.active === true
    )
  }

  // AJOUT DISPONIBILITE

  async function addAvailability(date, time) {
    if (isAvailable(date, time)) {
      return
    }

    const day = new Date(date)
      .toLocaleDateString(
        "fr-FR",
        {
          weekday: "long"
        }
      )
      .toLowerCase()

    const { error } = await supabase
      .from("availability")
      .insert({
        date: date,
        day: day,
        time: time,
        active: true
      })

    if (error) {
      console.log(error)
      return
    }

    loadData()
  }

  // SUPPRIMER DISPONIBILITE

  async function removeAvailability(date, time) {
    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("date", date)
      .eq("time", time)

    if (error) {
      console.log(error)
      return
    }

    loadData()
  }

  // RENDEZ VOUS

  function getAppointment(date, time) {
    return appointments.find(item => {
      const appointmentDate =
        item.date?.split("T")[0]

      return (
        appointmentDate === date &&
        item.time === time
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-black px-4 py-8 sm:px-8 lg:px-12">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">

          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-3">
              Administration
            </div>

            <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
              Mon planning
            </h1>

            <div className="w-10 h-px bg-black mt-5" />
          </div>

          {/* NAVIGATION */}

          <div className="flex items-center gap-2">

            <button
              onClick={() => changeWeek(-1)}
              className="w-12 h-12 rounded-full border border-black bg-white flex items-center justify-center text-lg transition hover:bg-black hover:text-white"
            >
              ←
            </button>

            <button
              onClick={() => changeWeek(1)}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg transition hover:bg-white hover:text-black hover:border hover:border-black"
            >
              →
            </button>

          </div>

        </div>

        {/* JOURS */}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">

          {getWeekDays().map(day => {
            const isSelected =
              selectedDay?.date === day.date

            return (
              <button
                key={day.date}
                onClick={() => selectDay(day)}
                className={`
                  relative
                  text-left
                  p-5
                  min-h-[105px]
                  rounded-[24px]
                  border
                  transition-all
                  duration-300
                  ${
                    isSelected
                      ? "bg-black text-white border-black shadow-lg"
                      : "bg-white border-black/10 hover:border-black/30 hover:shadow-md"
                  }
                `}
              >

                <div
                  className={`
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    mb-4
                    ${
                      isSelected
                        ? "text-white/50"
                        : "text-gray-400"
                    }
                  `}
                >
                  Jour
                </div>

                <div className="font-medium text-lg capitalize">
                  {day.name}
                </div>

                <div
                  className={`
                    text-sm mt-1
                    ${
                      isSelected
                        ? "text-white/50"
                        : "text-gray-400"
                    }
                  `}
                >
                  {day.date}
                </div>

                {isSelected && (
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-white" />
                )}

              </button>
            )
          })}

        </div>

        {/* SI AUCUN JOUR N'EST SELECTIONNE */}

        {!selectedDay && (
          <div className="bg-white border border-black/10 rounded-[32px] p-12 text-center shadow-sm">

            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-5 text-xl">
              +
            </div>

            <h2 className="text-xl font-medium">
              Sélectionnez une journée
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Choisissez un jour pour consulter votre planning.
            </p>

          </div>
        )}

        {/* JOUR SELECTIONNE */}

        {selectedDay && (
          <div className="bg-white rounded-[32px] border border-black/10 overflow-hidden shadow-sm">

            {/* TITRE */}

            <div className="px-6 py-7 sm:px-8 border-b border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

              <div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                  Planning du jour
                </div>

                <h2 className="text-2xl sm:text-3xl font-light capitalize tracking-tight">
                  {selectedDay.name}
                </h2>

              </div>

              <div className="text-sm text-gray-400">
                {selectedDay.date}
              </div>

            </div>

            {/* CRENEAUX */}

            <div className="divide-y divide-black/5">

              {times.map(time => {
                const active = isAvailable(
                  selectedDay.date,
                  time
                )

                const appointment = getAppointment(
                  selectedDay.date,
                  time
                )

                return (
                  <div
                    key={time}
                    className="px-4 py-3 sm:px-8"
                  >

                    {/* RENDEZ VOUS */}

                    {appointment && (
                      <div className="bg-black text-white rounded-[24px] p-5 sm:p-6">

                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                          {/* HEURE */}

                          <div className="sm:w-24 shrink-0">

                            <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                              Heure
                            </div>

                            <div className="text-2xl font-light">
                              {time}
                            </div>

                          </div>

                          <div className="hidden sm:block w-px h-14 bg-white/10" />

                          {/* CLIENT */}

                          <div className="flex-1">

                            <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                              Rendez-vous
                            </div>

                            <div className="text-xl sm:text-2xl font-medium">
                              {appointment.name}
                            </div>

                            <div className="text-sm text-white/50 mt-1">
                              {appointment.service}
                            </div>

                          </div>

                          {/* CONTACT */}

                          <div className="sm:border-l border-white/10 sm:pl-6 space-y-2 text-sm text-white/60">

                            <div>
                              {appointment.phone}
                            </div>

                            <div className="break-all">
                              {appointment.email}
                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* CRENEAU SANS RENDEZ VOUS */}

                    {!appointment && (
                      <button
                        onClick={() => {
                          if (active) {
                            removeAvailability(
                              selectedDay.date,
                              time
                            )
                          } else {
                            addAvailability(
                              selectedDay.date,
                              time
                            )
                          }
                        }}
                        className={`
                          w-full
                          flex
                          items-center
                          gap-5
                          text-left
                          p-5
                          rounded-[24px]
                          border
                          transition-all
                          duration-300
                          ${
                            active
                              ? "bg-[#f8f8f6] border-black/10 hover:border-black/30 hover:bg-white"
                              : "bg-white border-dashed border-black/10 hover:border-black/30 hover:bg-[#fafafa]"
                          }
                        `}
                      >

                        {/* HEURE */}

                        <div className="w-20 shrink-0">

                          <div className="text-lg font-medium">
                            {time}
                          </div>

                        </div>

                        {/* SEPARATEUR */}

                        <div
                          className={`
                            w-px
                            h-10
                            ${
                              active
                                ? "bg-black/10"
                                : "bg-black/5"
                            }
                          `}
                        />

                        {/* STATUT */}

                        <div className="flex-1">

                          <div className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                            Disponibilité
                          </div>

                          <div className="text-sm font-medium">
                            {active
                              ? "Créneau ouvert"
                              : "Créneau fermé"}
                          </div>

                        </div>

                        {/* BOUTON */}

                        <div className="flex items-center gap-3 shrink-0">

                          <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-gray-400">
                            {active
                              ? "Ouvert"
                              : "Fermé"}
                          </span>

                          <div
                            className={`
                              w-9
                              h-9
                              rounded-full
                              flex
                              items-center
                              justify-center
                              ${
                                active
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-gray-400"
                              }
                            `}
                          >
                            {active ? "✓" : "+"}
                          </div>

                        </div>

                      </button>
                    )}

                  </div>
                )
              })}

            </div>

          </div>
        )}

      </div>

    </div>
  )
}

export default Admin