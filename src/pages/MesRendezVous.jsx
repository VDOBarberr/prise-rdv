import React, { useState } from "react";
import { supabase } from "../services/supabase";

function MesRendezVous() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ÉTATS POUR LE DÉCALAGE DE RDV
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  // FONCTION DE NORMALISATION DU TÉLÉPHONE (+33 6 XX... -> 06XX...)
  function cleanPhoneNumber(rawPhone) {
    if (!rawPhone) return "";
    
    // Enlève tous les espaces, tirets, points et parenthèses
    let cleaned = rawPhone.replace(/[\s\.\-\(\)]/g, "");

    // Si le numéro commence par +33, on remplace par 0
    if (cleaned.startsWith("+33")) {
      cleaned = "0" + cleaned.slice(3);
    } 
    // Si le numéro commence par 33 sans le +, on remplace aussi par 0
    else if (cleaned.startsWith("33") && cleaned.length > 10) {
      cleaned = "0" + cleaned.slice(2);
    }

    return cleaned;
  }

  // RECHERCHE UNIVERSELLE DE RDV
  async function searchAppointments(e) {
    if (e && e.preventDefault) e.preventDefault();

    setMessage("");
    setAppointments([]);

    if (!name.trim() || !phone.trim()) {
      setMessage("Veuillez renseigner votre nom et votre téléphone.");
      return;
    }

    setLoading(true);

    try {
      const cleanName = name.trim();
      const searchedPhone = cleanPhoneNumber(phone);

      // Recherche par nom dans Supabase
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .ilike("name", `%${cleanName}%`);

      if (error) {
        console.error("Erreur recherche :", error);
        setMessage("Une erreur est survenue lors de la recherche.");
        return;
      }

      // Filtrage intelligent du numéro de téléphone
      const filtered = (data || []).filter((item) => {
        const dbPhoneClean = cleanPhoneNumber(item.phone);
        return dbPhoneClean.includes(searchedPhone) || searchedPhone.includes(dbPhoneClean);
      });

      if (filtered.length === 0) {
        setMessage("Aucun rendez-vous trouvé. Vérifiez le nom et le numéro de téléphone.");
        return;
      }

      setAppointments(filtered);
    } catch (error) {
      console.error(error);
      setMessage("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  // RÈGLE DES 24H
  function canReschedule(appointment) {
    if (!appointment?.date || !appointment?.time) return false;

    try {
      const datePart = appointment.date.split("T")[0];
      const hour = parseInt(appointment.time.replace("h", "").replace("00", ""), 10) || 0;

      const apptDate = new Date(`${datePart}T${String(hour).padStart(2, "0")}:00:00`);
      const now = new Date();

      const diffInMs = apptDate.getTime() - now.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return diffInHours >= 24;
    } catch (err) {
      return false;
    }
  }

  // OUVRIR LA MODALE DE DÉCALAGE
  function openRescheduleModal(appointment) {
    setReschedulingAppointment(appointment);
    setNewDate("");
    setAvailableTimes([]);
    setSelectedTime("");
    setRescheduleMessage("");
  }

  // RECHERCHER LES CRÉNEAUX DISPONIBLES
  async function handleDateChange(e) {
    const selectedDate = e.target.value;
    setNewDate(selectedDate);
    setSelectedTime("");
    setRescheduleMessage("");

    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    setLoadingSlots(true);

    try {
      const { data: availData, error: availError } = await supabase
        .from("availability")
        .select("*")
        .eq("date", selectedDate)
        .eq("active", true);

      if (availError) {
        console.error(availError);
        setRescheduleMessage("Erreur lors de la récupération des créneaux.");
        setLoadingSlots(false);
        return;
      }

      setAvailableTimes(availData || []);
      if (!availData || availData.length === 0) {
        setRescheduleMessage("Aucun créneau disponible pour cette date.");
      }
    } catch (err) {
      console.error(err);
      setRescheduleMessage("Erreur lors du chargement des créneaux.");
    } finally {
      setLoadingSlots(false);
    }
  }

  // CONFIRMER LE DÉCALAGE SANS CRÉER DE DOUBLONS DANS LA DB
  async function confirmReschedule() {
    if (!reschedulingAppointment || !newDate || !selectedTime) {
      setRescheduleMessage("Veuillez sélectionner une date et une heure.");
      return;
    }

    setRescheduling(true);
    setRescheduleMessage("");

    try {
      const oldDate = reschedulingAppointment.date?.split("T")[0];
      const oldTime = reschedulingAppointment.time;

      // 1. Mettre à jour le rendez-vous dans la table appointments
      const { error: updateError } = await supabase
        .from("appointments")
        .update({
          date: newDate,
          time: selectedTime,
        })
        .eq("id", reschedulingAppointment.id);

      if (updateError) throw updateError;

      // 2. Libérer l'ancien créneau de façon sécurisée (sans doublons)
      if (oldDate && oldTime) {
        const { data: existingSlots } = await supabase
          .from("availability")
          .select("id")
          .eq("date", oldDate)
          .eq("time", oldTime);

        if (existingSlots && existingSlots.length > 0) {
          // Met à jour la première entrée
          await supabase
            .from("availability")
            .update({ active: true })
            .eq("id", existingSlots[0].id);

          // Supprime les doublons éventuels
          if (existingSlots.length > 1) {
            const idsToDelete = existingSlots.slice(1).map((s) => s.id);
            await supabase.from("availability").delete().in("id", idsToDelete);
          }
        } else {
          // Si le créneau n'existait pas, on le crée une seule fois
          await supabase
            .from("availability")
            .insert([{ date: oldDate, time: oldTime, active: true }]);
        }
      }

      // 3. Verrouiller le nouveau créneau
      await supabase
        .from("availability")
        .update({ active: false })
        .eq("date", newDate)
        .eq("time", selectedTime);

      setReschedulingAppointment(null);
      await searchAppointments();
    } catch (err) {
      console.error(err);
      setRescheduleMessage("Une erreur est survenue lors du décalage.");
    } finally {
      setRescheduling(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans pb-28">
      
      {/* STYLES ET ANIMATIONS */}
      <style>{`
        @keyframes rotateSlow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes lightSweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }

        .anim-rotate { animation: rotateSlow 25s linear infinite; }

        .card-luxury {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-badass {
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          user-select: none;
        }

        .btn-badass::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: translateX(-150%) skewX(-25deg);
        }

        .btn-badass:hover::before {
          animation: lightSweep 0.85s ease-in-out infinite;
        }

        .btn-badass:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(7, 7, 9, 0.35);
        }

        .btn-badass:active {
          transform: translateY(2px) scale(0.95) !important;
        }

        .card-appointment {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-appointment:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* BACKGROUND ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-12">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-md text-[10px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-8 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            Suivi des réservations
          </div>

          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none text-[#070709]">
            Mes <span className="text-transparent bg-clip-text bg-gradient-to-b from-black via-gray-700 to-gray-400 italic font-light">rendez-vous</span>
          </h1>

          <p className="max-w-md mx-auto mt-6 text-sm md:text-base font-light tracking-wide text-gray-600 leading-relaxed">
            Retrouvez instantanément vos rendez-vous enregistrés chez VDO Barber.
          </p>
        </div>

        {/* POLITIQUE D'ANNULATION */}
        <section className="card-luxury rounded-3xl p-6 md:p-8 mb-12 border border-black/10 bg-white/70 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg">⚖️</span>
            <h3 className="font-serif text-lg font-bold text-[#070709]">
              Politique d'annulation & de modification
            </h3>
          </div>

          <ul className="space-y-2 text-xs md:text-sm text-gray-600 font-light leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-black">•</span>
              <span>
                <strong>Décalage sans frais :</strong> Vous pouvez décaler votre rendez-vous directement en ligne jusqu'à <strong>24 heures avant</strong> l'horaire prévu.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-black">•</span>
              <span>
                <strong>Premier imprévu :</strong> En cas d'annulation ou modification tardive (moins de 24h) pour la première fois, aucun frais ne sera appliqué.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-black">•</span>
              <span>
                <strong>Récidive (2 fois et plus) :</strong> Un supplément de <strong>5,00 €</strong> sera appliqué sur votre prochaine prestation.
              </span>
            </li>
          </ul>
        </section>

        {/* FORMULAIRE DE RECHERCHE */}
        <section className="card-luxury rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#070709] text-white flex items-center justify-center font-black text-xs shadow-md">
              01
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-extrabold block">
                Identification
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#070709]">
                Retrouver mon rendez-vous
              </h2>
            </div>
          </div>

          <form onSubmit={searchAppointments} className="space-y-6">
            
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2.5">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dupont"
                className="w-full bg-white/80 border border-black/10 p-4 md:p-5 rounded-2xl text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2.5">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0612345678 ou +33612345678"
                className="w-full bg-[#FAFAF8] border border-black/10 p-4 md:p-5 rounded-2xl text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white shadow-sm"
              />
            </div>

            {message && (
              <div className="rounded-2xl p-4 bg-black/5 border border-black/10 text-gray-700 text-xs font-semibold text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-badass w-full bg-[#070709] text-white py-5 rounded-2xl uppercase tracking-[0.25em] text-xs font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Recherche en cours..." : "Retrouver mon rendez-vous"}
            </button>

          </form>
        </section>

        {/* AFFICHAGE DES RÉSULTATS */}
        {appointments.length > 0 && (
          <section className="card-luxury rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-md">
                ✓
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-extrabold block">
                  Confirmation
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#070709]">
                  {appointments.length > 1 ? "Vos rendez-vous" : "Votre rendez-vous"}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {appointments.map((appointment) => {
                const canChange = canReschedule(appointment);

                return (
                  <div
                    key={appointment.id}
                    className="card-appointment bg-[#070709] text-white rounded-3xl p-7 md:p-8 shadow-2xl relative overflow-hidden border border-white/10"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                          Date
                        </p>
                        <p className="font-serif text-2xl font-bold">
                          {appointment.date}
                        </p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                          Heure
                        </p>
                        <p className="font-serif text-2xl font-bold">
                          {appointment.time}
                        </p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                          Prestation
                        </p>
                        <p className="font-serif text-xl font-bold text-gray-200">
                          {appointment.service}
                        </p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                          Statut
                        </p>
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-wider">
                            {appointment.status || "Confirmé"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        {canChange ? (
                          <button
                            type="button"
                            onClick={() => openRescheduleModal(appointment)}
                            className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Décaler mon RDV
                          </button>
                        ) : (
                          <div className="space-y-1">
                            <button
                              type="button"
                              disabled
                              className="px-5 py-2.5 bg-white/10 text-gray-500 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-not-allowed border border-white/5"
                            >
                              Décaler mon RDV
                            </button>
                            <p className="text-[10px] text-gray-400 italic">
                              Modification possible jusqu'à 24h avant le rendez-vous.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 font-medium sm:text-right">
                        <p>Lieu : VDO Barber Studio</p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MODALE REPROGRAMMATION */}
        {reschedulingAppointment && (
          <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="w-full max-w-lg card-luxury rounded-[2.5rem] p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto bg-white border border-black/10">
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-extrabold block mb-1">
                    Modification
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#070709]">
                    Choisir un nouveau créneau
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center font-bold text-lg hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-black/5 p-4 rounded-2xl text-xs">
                  <p className="text-gray-500 uppercase tracking-widest font-bold text-[9px] mb-1">RDV actuel</p>
                  <p className="font-bold text-black text-sm">
                    {reschedulingAppointment.date} à {reschedulingAppointment.time} ({reschedulingAppointment.service})
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2">
                    Nouvelle Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {newDate && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2">
                      Créneaux disponibles
                    </label>

                    {loadingSlots ? (
                      <p className="text-xs text-gray-500 italic">Recherche des disponibilités...</p>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((slot) => (
                          <button
                            key={slot.id || slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedTime === slot.time
                                ? "bg-black text-white border-black shadow-md scale-[1.02]"
                                : "bg-gray-50 text-black border-black/10 hover:border-black"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        {rescheduleMessage || "Choisissez une autre date."}
                      </p>
                    )}
                  </div>
                )}

                {rescheduleMessage && availableTimes.length > 0 && (
                  <div className="text-xs font-semibold text-center text-red-600">
                    {rescheduleMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setReschedulingAppointment(null)}
                    className="flex-1 border border-black/10 py-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    disabled={!selectedTime || rescheduling}
                    onClick={confirmReschedule}
                    className="btn-badass flex-1 bg-[#070709] text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {rescheduling ? "Modification..." : "Confirmer"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MesRendezVous;