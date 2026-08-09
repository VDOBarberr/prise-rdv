import React, { useState } from "react";
import { supabase } from "../services/supabase";

function MesRendezVous() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function searchAppointments(e) {
    e.preventDefault();

    setMessage("");
    setAppointments([]);

    if (!name.trim() || !phone.trim()) {
      setMessage("Veuillez renseigner votre nom et votre téléphone.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .ilike("name", name.trim())
        .eq("phone", phone.trim())
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) {
        console.error("Erreur recherche rendez-vous :", error);
        setMessage("Une erreur est survenue lors de la recherche.");
        return;
      }

      if (!data || data.length === 0) {
        setMessage("Aucun rendez-vous trouvé avec ces informations.");
        return;
      }

      setAppointments(data);
    } catch (error) {
      console.error(error);
      setMessage("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans pb-28">
      
      {/* STYLES & ANIMATIONS SUR-MESURE */}
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

        /* Carte Luxe */
        .card-luxury {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Animation des Boutons de Réservation & Recherche */
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
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
        }

        .card-appointment {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-appointment:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ & DYNAMIQUE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-12">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
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

        {/* SECTION FORMULAIRE DE RECHERCHE */}
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
            
            {/* NOM */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2.5">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dupont"
                className="w-full bg-white/80 border border-black/10 p-4 md:p-5 rounded-2xl text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white focus:scale-[1.01] shadow-sm"
              />
            </div>

            {/* TELEPHONE */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2.5">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0612345678"
                className="w-full bg-[#FAFAF8] border border-black/10 p-4 md:p-5 rounded-2xl text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white focus:scale-[1.01] shadow-sm"
              />
            </div>

            {/* MESSAGE D'INFORMATION OU ERREUR */}
            {message && (
              <div className="rounded-2xl p-4 bg-black/5 border border-black/10 text-gray-700 text-xs font-semibold text-center animate-fade-in">
                {message}
              </div>
            )}

            {/* BOUTON RECHERCHER */}
            <button
              type="submit"
              disabled={loading}
              className="btn-badass w-full bg-[#070709] text-white py-5 rounded-2xl uppercase tracking-[0.25em] text-xs font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recherche en cours...
                </span>
              ) : (
                "Retrouver mon rendez-vous"
              )}
            </button>

          </form>
        </section>

        {/* SECTION RÉSULTATS */}
        {appointments.length > 0 && (
          <section className="card-luxury rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-md">
                ✓
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-extrabold block">
                  Confirmation
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#070709]">
                  {appointments.length > 1 ? "Vos rendez-vous trouvés" : "Votre rendez-vous"}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="card-appointment bg-[#070709] text-white rounded-3xl p-7 md:p-8 shadow-2xl relative overflow-hidden border border-white/10"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* DATE */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                        Date
                      </p>
                      <p className="font-serif text-2xl font-bold">
                        {appointment.date}
                      </p>
                    </div>

                    {/* HEURE */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                        Heure
                      </p>
                      <p className="font-serif text-2xl font-bold">
                        {appointment.time}
                      </p>
                    </div>

                    {/* PRESTATION */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold mb-1">
                        Prestation
                      </p>
                      <p className="font-serif text-xl font-bold text-gray-200">
                        {appointment.service}
                      </p>
                    </div>

                    {/* STATUT */}
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

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Lieu : VDO Barber Studio</span>
                    <span className="text-[10px] tracking-widest uppercase text-gray-500">
                      Victor.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default MesRendezVous;