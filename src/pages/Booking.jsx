import { useState } from "react"
import { supabase } from "../services/supabase"

function formatPhoneNumber(phone) {
  const cleaned = (phone || "").replace(/\D/g, "")
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    return "0" + cleaned.slice(2)
  }
  return cleaned
}

function getTodayDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function isSlotInPast(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false

  const match = String(timeStr).match(/^(\d{1,2})h?(\d{2})?$/i)
  if (!match) return false

  const hours = Number(match[1])
  const minutes = Number(match[2] || 0)

  const slotDate = new Date(`${dateStr}T00:00:00`)
  slotDate.setHours(hours, minutes, 0, 0)

  return slotDate <= new Date()
}

const SERVICES = [
  {
    name: "Coupe",
    price: "15€",
    description: "Coupe sur-mesure & finition haute précision",
  },
  {
    name: "Coupe + Taille Barbe",
    price: "20€",
    description: "Coupe sur-mesure & taille de barbe avec finitions haute précision.",
  },
  {
    name: "Transformation",
    price: "20€",
    description: "Changement de style complet (+2 mois de repousse)",
  },
]

function Booking() {
  const [availability, setAvailability] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showServices, setShowServices] = useState(false)

  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading] = useState(false)

  const [confirmed, setConfirmed] = useState(false)
  const [confirmationData, setConfirmationData] = useState(null)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  })

  async function loadAvailability(date) {
    if (!date) {
      setAvailability([])
      return
    }

    setLoadingSlots(true)
    setMessage("")
    setSelectedSlot(null)

    try {
      const { data, error } = await supabase
        .from("availability")
        .select("id, date, time, active")
        .eq("date", date)
        .eq("active", true)
        .order("time", { ascending: true })

      if (error) {
        console.error("Erreur chargement disponibilités :", error)
        setAvailability([])
        setMessage("Impossible de charger les créneaux. Réessayez.")
        return
      }

      setAvailability(data || [])
    } catch (error) {
      console.error("Erreur chargement disponibilités :", error)
      setAvailability([])
      setMessage("Impossible de charger les créneaux. Réessayez.")
    } finally {
      setLoadingSlots(false)
    }
  }

  async function createAppointment(e) {
    e.preventDefault()
    setMessage("")

    if (!selectedSlot) {
      setMessage("Veuillez sélectionner un créneau.")
      return
    }

    if (isSlotInPast(selectedSlot.date, selectedSlot.time)) {
      setMessage("Ce créneau horaire est déjà dépassé. Veuillez en choisir un autre.")
      setSelectedSlot(null)
      return
    }

    if (!form.name || !form.phone || !form.email || !form.service) {
      setMessage("Veuillez remplir tous les champs du formulaire.")
      return
    }

    setLoading(true)

    const formattedPhone = formatPhoneNumber(form.phone)

    try {
      // Réserve d'abord le créneau de façon atomique.
      // Le filtre active=true empêche deux personnes de prendre le même créneau.
      const { data: reservedSlot, error: reserveError } = await supabase
        .from("availability")
        .update({ active: false })
        .eq("id", selectedSlot.id)
        .eq("active", true)
        .select("id")
        .maybeSingle()

      if (reserveError || !reservedSlot) {
        setMessage("Ce créneau vient probablement d'être réservé. Choisissez-en un autre.")
        await loadAvailability(selectedDate)
        return
      }

      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          name: form.name.trim(),
          phone: formattedPhone,
          email: form.email.trim(),
          service: form.service,
          date: selectedSlot.date,
          time: selectedSlot.time,
          status: "Confirmé",
        })

      if (appointmentError) {
        // Si la création du RDV échoue, on rend le créneau disponible.
        await supabase
          .from("availability")
          .update({ active: true })
          .eq("id", selectedSlot.id)

        setMessage("La réservation n'a pas pu être enregistrée. Réessayez.")
        await loadAvailability(selectedDate)
        return
      }

      setConfirmationData({
        name: form.name.trim(),
        phone: formattedPhone,
        email: form.email.trim(),
        service: form.service,
        date: selectedSlot.date,
        time: selectedSlot.time,
      })

      setConfirmed(true)
      setAvailability((prev) => prev.filter((slot) => slot.id !== selectedSlot.id))
    } catch (error) {
      console.error("Erreur réservation :", error)
      setMessage("Une erreur inattendue est survenue. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  const availableSlots = availability.filter(
    (slot) => !isSlotInPast(slot.date, slot.time)
  )

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-28 pt-10 px-4 sm:px-6 relative overflow-hidden selection:bg-black selection:text-white">
      {/* Fond volontairement léger : aucun gros blur ni animation permanente. */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-black/[0.025]" />
        <div className="absolute bottom-[-180px] right-[-80px] w-[400px] h-[400px] rounded-full bg-black/[0.018]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#0A0A0A 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-black text-[10px] tracking-[0.3em] uppercase font-black mb-5">
            <span className="w-2 h-2 rounded-full bg-black" />
            VDO Barber Experience
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-black uppercase tracking-tight text-[#0A0A0A] mb-3">
            RÉSERVATION <span className="italic font-light text-gray-400">CLUB</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium">
            Prenez rendez-vous en quelques secondes
          </p>
        </header>

        {confirmed && confirmationData ? (
          <div className="bg-white border border-black/10 rounded-[2.5rem] p-8 sm:p-12 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-xl">
              ✓
            </div>

            <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-black">
              Confirmation Instantanée
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#0A0A0A] mt-1 mb-8">
              Rendez-vous Validé !
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
              <div className="bg-gray-50 border border-black/5 rounded-2xl p-4">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Nom</span>
                <span className="text-lg font-bold text-[#0A0A0A]">{confirmationData.name}</span>
              </div>

              <div className="bg-gray-50 border border-black/5 rounded-2xl p-4">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Prestation</span>
                <span className="text-lg font-bold text-[#0A0A0A]">{confirmationData.service}</span>
              </div>

              <div className="bg-gray-50 border border-black/5 rounded-2xl p-4">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Date</span>
                <span className="text-lg font-bold text-[#0A0A0A]">{confirmationData.date}</span>
              </div>

              <div className="bg-gray-50 border border-black/5 rounded-2xl p-4">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Horaire</span>
                <span className="text-lg font-bold text-[#0A0A0A]">{confirmationData.time}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              À très vite !
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="bg-white border border-black/10 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-9 h-9 rounded-2xl bg-black text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                  01
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">Sélectionnez une date</h2>
                  <p className="text-xs text-gray-500">Consultez les disponibilités en temps réel</p>
                </div>
              </div>

              <input
                type="date"
                min={getTodayDate()}
                value={selectedDate}
                onChange={(e) => {
                  const date = e.target.value
                  setSelectedDate(date)
                  setMessage("")
                  loadAvailability(date)
                }}
                className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] font-semibold text-base outline-none focus:border-black focus:bg-white transition-colors cursor-pointer shadow-sm"
              />
            </section>

            {selectedDate && (
              <section className="bg-white border border-black/10 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-black text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    02
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">Choisissez votre créneau</h2>
                    <p className="text-xs text-gray-500">Heures disponibles le {selectedDate}</p>
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="text-center text-gray-500 py-6 text-sm font-medium">
                    Chargement des créneaux...
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot)
                            setMessage("")
                          }}
                          className={`p-4 rounded-2xl font-bold text-base border relative overflow-hidden transition-colors ${
                            isSelected
                              ? "bg-[#0A0A0A] text-white border-black shadow-xl"
                              : "bg-gray-50 text-[#0A0A0A] border-black/10 hover:border-black/30 hover:bg-white"
                          }`}
                        >
                          {slot.time}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6 text-sm font-medium">
                    Aucun créneau disponible pour cette date.
                  </p>
                )}
              </section>
            )}

            {selectedSlot && (
              <section className="bg-white border border-black/10 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-black text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    03
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">Finalisez votre réservation</h2>
                    <p className="text-xs text-gray-500">Informations & choix du service</p>
                  </div>
                </div>

                <form onSubmit={createAppointment} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-colors shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-colors shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jean@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-2">
                      Service souhaité
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowServices((value) => !value)}
                      className="w-full bg-gray-50 border border-black/10 p-4 rounded-2xl text-left flex justify-between items-center text-[#0A0A0A] font-bold text-sm hover:border-black transition-colors shadow-sm"
                    >
                      <span>{form.service || "Sélectionnez une prestation"}</span>
                      <span className={showServices ? "rotate-180" : ""}>▼</span>
                    </button>

                    {showServices && (
                      <div className="mt-3 bg-[#0A0A0A] text-white rounded-2xl overflow-hidden shadow-2xl border border-black">
                        {SERVICES.map((service) => (
                          <button
                            key={service.name}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                service: `${service.name} (${service.price})`,
                              }))
                              setShowServices(false)
                            }}
                            className="w-full p-4 text-left border-b border-white/10 last:border-none hover:bg-white hover:text-black transition-colors flex justify-between items-center group"
                          >
                            <div>
                              <p className="font-bold text-sm">{service.name}</p>
                              <p className="text-xs text-gray-400 group-hover:text-gray-600">
                                {service.description}
                              </p>
                            </div>
                            <span className="font-black text-base">{service.price}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A0A0A] text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs mt-4 disabled:opacity-50 shadow-xl active:scale-[0.99] transition-transform"
                  >
                    {loading ? "Validation..." : "Confirmer le rendez-vous"}
                  </button>
                </form>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking
