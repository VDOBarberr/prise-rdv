import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

// Fonction de normalisation du numéro de téléphone
function formatPhoneNumber(phone) {
  if (!phone) return ""
  let cleaned = phone.replace(/\D/g, "")
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    cleaned = "0" + cleaned.slice(2)
  }
  return cleaned
}

// Fonction de vérification si le créneau est déjà passé
function isSlotInPast(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;

  // Transforme "11h00" en "11:00"
  const formattedTime = timeStr.replace("h", ":");
  
  // Date et heure complètes du créneau
  const slotDate = new Date(`${dateStr}T${formattedTime}:00`);
  const now = new Date();

  return slotDate <= now;
}

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
      description: "Coupe sur-mesure & finition haute précision"
    },
    {
      name: "Coupe + Taille Barbe ",
      price: "20€",
      description: "Coupe sur-mesure & taille de barbe avec finitions haute précision."
    },
    {
      name: "Transformation",
      price: "20€",
      description: "Changement de style complet (+2 mois de repousse)"
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
      console.error("Erreur chargement disponibilités :", error)
      return
    }

    setAvailability(data || [])
  }

  useEffect(() => {
    loadAvailability()
  }, [])

  // Filtrage des créneaux : on garde uniquement ceux de la date sélectionnée QUI NE SONT PAS PASSÉS
  const availableSlots = availability.filter(
    (slot) => slot.date === selectedDate && !isSlotInPast(slot.date, slot.time)
  )

  async function createAppointment(e) {
    e.preventDefault()
    setMessage("")

    if (!selectedSlot) {
      setMessage("Veuillez sélectionner un créneau.")
      return
    }

    // Sécurité supplémentaire si le temps s'est écoulé pendant la saisie du formulaire
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

    try {
      const { data: currentSlot, error: checkError } = await supabase
        .from("availability")
        .select("*")
        .eq("id", selectedSlot.id)
        .eq("active", true)
        .maybeSingle()

      if (checkError || !currentSlot) {
        setAvailability((prev) => prev.filter((slot) => slot.id !== selectedSlot.id))
        setSelectedSlot(null)
        setMessage("Ce créneau n'est plus disponible.")
        return
      }

      const formattedPhone = formatPhoneNumber(form.phone)

      const appointmentData = {
        name: form.name,
        phone: formattedPhone,
        email: form.email,
        service: form.service,
        date: currentSlot.date,
        time: currentSlot.time,
        status: "Confirmé"
      }

      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert(appointmentData)

      if (appointmentError) {
        setMessage("Erreur lors de l'enregistrement de la réservation.")
        return
      }

      const newConfirmation = {
        name: form.name,
        phone: formattedPhone,
        email: form.email,
        service: form.service,
        date: currentSlot.date,
        time: currentSlot.time
      }

      setConfirmationData(newConfirmation)
      setConfirmed(true)

      await supabase
        .from("availability")
        .update({ active: false })
        .eq("id", currentSlot.id)

      setAvailability((prev) => prev.filter((slot) => slot.id !== currentSlot.id))
    } catch (err) {
      setMessage("Une erreur inattendue est survenue.")
    } finally {
      setLoading(false)
    }
  }

  // Date du jour au format YYYY-MM-DD pour bloquer la sélection de jours passés dans le calendrier
  const todayDateString = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] font-sans pb-28 pt-10 px-4 sm:px-6 relative overflow-hidden selection:bg-black selection:text-white">
      
      {/* ANIMATIONS ET STYLES LUMINEUX */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }

        @keyframes lightSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes popUp {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-pop { animation: popUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .bg-orb-1 { animation: floatSlow 16s ease-in-out infinite; }
        .bg-orb-2 { animation: floatSlow 22s ease-in-out infinite reverse; }

        .glass-panel-light {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(10, 10, 10, 0.08);
          box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.05);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-panel-light:hover {
          border-color: rgba(10, 10, 10, 0.2);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.1);
        }

        .btn-black-glow {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-black-glow::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: translateX(-100%);
        }

        .btn-black-glow:hover::after {
          animation: lightSweep 0.8s ease-in-out infinite;
        }

        .btn-black-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(10, 10, 10, 0.3);
        }

        .btn-black-glow:active {
          transform: translateY(1px) scale(0.98);
        }
      `}</style>

      {/* ARRIÈRE-PLAN LUMINEUX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-orb-1 absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-black/[0.03] rounded-full blur-[140px]" />
        <div className="bg-orb-2 absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-black/[0.02] rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#0A0A0A 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* HEADER BRANDING */}
        <header className="text-center mb-12 sm:mb-16 animate-pop">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-black text-[10px] tracking-[0.3em] uppercase font-black mb-5">
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            VDO Barber Experience
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-black uppercase tracking-tight text-[#0A0A0A] mb-3">
            RÉSERVATION <span className="italic font-light text-gray-400">CLUB</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium">
            Prenez rendez-vous en quelques secondes
          </p>
        </header>

        {/* ECRAN DE CONFIRMATION */}
        {confirmed && confirmationData ? (
          <div className="glass-panel-light rounded-[2.5rem] p-8 sm:p-12 text-center border border-black/10 animate-pop relative overflow-hidden">
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

          /* PARCOURS EN ÉTAPES INTERACTIVES */
          <div className="space-y-8">

            {/* ÉTAPE 1 : CHOIX DE LA DATE */}
            <section className="glass-panel-light rounded-[2.5rem] p-7 sm:p-9 animate-pop">
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
                min={todayDateString} // Empêche de sélectionner des jours passés
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedSlot(null)
                  setMessage("")
                }}
                className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] font-semibold text-base outline-none focus:border-black focus:bg-white transition-all cursor-pointer shadow-sm"
              />
            </section>

            {/* ÉTAPE 2 : CHOIX DE L'HORAIRE */}
            {selectedDate && (
              <section className="glass-panel-light rounded-[2.5rem] p-7 sm:p-9 animate-pop">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-black text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    02
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">Choisissez votre créneau</h2>
                    <p className="text-xs text-gray-500">Heures disponibles le {selectedDate}</p>
                  </div>
                </div>

                {availableSlots.length > 0 ? (
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
                          className={`p-4 rounded-2xl font-bold text-base transition-all duration-300 border relative overflow-hidden ${
                            isSelected
                              ? "bg-[#0A0A0A] text-white border-black shadow-xl scale-105"
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

            {/* ÉTAPE 3 : FORMULAIRE & PRESTATION */}
            {selectedSlot && (
              <section className="glass-panel-light rounded-[2.5rem] p-7 sm:p-9 animate-pop">
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
                      className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-all shadow-sm"
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
                        className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-all shadow-sm"
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
                        className="w-full bg-gray-50 border border-black/10 rounded-2xl p-4 text-[#0A0A0A] placeholder-gray-400 outline-none focus:border-black focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* SÉLECTEUR MENU PRESTATION */}
                  <div className="relative pt-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-extrabold mb-2">
                      Service souhaité
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowServices(!showServices)}
                      className="w-full bg-gray-50 border border-black/10 p-4 rounded-2xl text-left flex justify-between items-center text-[#0A0A0A] font-bold text-sm hover:border-black transition-all shadow-sm"
                    >
                      <span>{form.service || "Sélectionnez une prestation"}</span>
                      <span className={`transition-transform duration-300 ${showServices ? "rotate-180" : ""}`}>▼</span>
                    </button>

                    {showServices && (
                      <div className="mt-3 bg-[#0A0A0A] text-white rounded-2xl overflow-hidden shadow-2xl animate-pop border border-black">
                        {services.map((s) => (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, service: `${s.name} (${s.price})` })
                              setShowServices(false)
                            }}
                            className="w-full p-4 text-left border-b border-white/10 last:border-none hover:bg-white hover:text-black transition-all flex justify-between items-center group cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-sm">{s.name}</p>
                              <p className="text-xs text-gray-400 group-hover:text-gray-600">{s.description}</p>
                            </div>
                            <span className="font-black text-base">{s.price}</span>
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
                    className="btn-black-glow w-full bg-[#0A0A0A] text-white font-black py-5 rounded-2xl uppercase tracking-[0.25em] text-xs mt-4 disabled:opacity-50 shadow-xl"
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