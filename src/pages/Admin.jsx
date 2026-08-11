import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Admin() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isChangingWeek, setIsChangingWeek] = useState(false);

  const daysOrder = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

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
    "18h00",
  ];

  // DÉCONNEXION
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Erreur lors de la déconnexion :", error);
      alert("Erreur lors de la déconnexion.");
    } else {
      window.location.reload();
    }
  }

  // CHARGEMENT DES DONNÉES
  async function loadData() {
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("availability")
      .select("*");

    if (availabilityError) {
      console.log(availabilityError);
      return;
    }

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from("appointments")
      .select("*");

    if (appointmentsError) {
      console.log(appointmentsError);
      return;
    }

    setAvailability(availabilityData || []);
    setAppointments(appointmentsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  // DATE DU LUNDI
  function getMonday(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    return result;
  }

  // FORMAT DATE
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // CHANGER DE SEMAINE AVEC ANIMATION
  function changeWeek(value) {
    setIsChangingWeek(true);
    setTimeout(() => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + value * 7);
      setCurrentDate(date);
      setIsChangingWeek(false);
    }, 200);
  }

  // JOURS DE LA SEMAINE
  function getWeekDays() {
    const monday = getMonday(currentDate);
    return daysOrder.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        name: day,
        date: formatDate(date),
      };
    });
  }

  // SÉLECTION JOUR
  function selectDay(day) {
    setSelectedDay(day);
  }

  // VÉRIFIER DISPONIBILITÉ
  function isAvailable(date, time) {
    return availability.some(
      (item) => item.date === date && item.time === time && item.active === true
    );
  }

  // AJOUT DISPONIBILITÉ
  async function addAvailability(date, time) {
    if (isAvailable(date, time)) return;

    const day = new Date(date)
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .toLowerCase();

    const { error } = await supabase.from("availability").insert({
      date: date,
      day: day,
      time: time,
      active: true,
    });

    if (error) {
      console.log(error);
      return;
    }

    await loadData();
  }

  // SUPPRIMER DISPONIBILITÉ
  async function removeAvailability(date, time) {
    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("date", date)
      .eq("time", time);

    if (error) {
      console.log(error);
      return;
    }

    await loadData();
  }

  // TROUVER RENDEZ-VOUS
  function getAppointment(date, time) {
    return appointments.find((item) => {
      const appointmentDate = item.date?.split("T")[0];
      return appointmentDate === date && item.time === time;
    });
  }

  // MODIFIER RENDEZ-VOUS
  async function saveAppointment() {
    if (!editingAppointment) return;

    const newDate = editingAppointment.date?.split("T")[0];

    const { error } = await supabase
      .from("appointments")
      .update({
        name: editingAppointment.name,
        phone: editingAppointment.phone,
        email: editingAppointment.email,
        service: editingAppointment.service,
        date: newDate,
        time: editingAppointment.time,
      })
      .eq("id", editingAppointment.id);

    if (error) {
      console.log(error);
      alert("Erreur lors de la modification du rendez-vous.");
      return;
    }

    setEditingAppointment(null);
    await loadData();
  }

  // SUPPRIMER RENDEZ-VOUS
  async function deleteAppointment() {
    if (!editingAppointment) return;

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce rendez-vous ?"
    );

    if (!confirmation) return;

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", editingAppointment.id);

    if (error) {
      console.log(error);
      alert("Erreur lors de la suppression.");
      return;
    }

    setEditingAppointment(null);
    await loadData();
  }

  // Date du jour au format YYYY-MM-DD
  const todayStr = formatDate(new Date());

  // Récupération des 3 prochains RDV (à partir d'aujourd'hui)
  const upcomingAppointments = appointments
    .filter((item) => {
      const appointmentDate = item.date?.split("T")[0];
      return appointmentDate >= todayStr;
    })
    .sort((a, b) => {
      const dateA = a.date?.split("T")[0];
      const dateB = b.date?.split("T")[0];

      // Tri par date croissante
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      // Si la date est identique, tri par heure croissante
      return a.time.localeCompare(b.time);
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans pb-28">
      
      {/* STYLES & ANIMATIONS MODERNES */}
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

        /* Transition de changement de semaine */
        .week-grid {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .week-grid-animating {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }

        /* Carte Dashboard */
        .card-dash {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-dash:hover {
          border-color: rgba(0, 0, 0, 0.18);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
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
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(7, 7, 9, 0.3);
        }

        .btn-badass:active {
          transform: translateY(1px) scale(0.96) !important;
        }
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-[9px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Panneau de Gestion
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#070709]">
              Mon <span className="italic font-light text-gray-500">Planning</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* SÉLECTEUR DE SEMAINE AVEC FLÈCHES UNIFORMISÉES */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-full border border-black/10 shadow-sm">
              <button
                onClick={() => changeWeek(-1)}
                className="w-12 h-12 rounded-full bg-[#070709] text-white hover:bg-gray-800 transition-all duration-300 flex items-center justify-center font-bold text-lg active:scale-90 shadow-md"
                title="Semaine précédente"
              >
                ←
              </button>
              <span className="text-xs font-black uppercase tracking-widest px-4 text-gray-600">
                Changer Semaine
              </span>
              <button
                onClick={() => changeWeek(1)}
                className="w-12 h-12 rounded-full bg-[#070709] text-white hover:bg-gray-800 transition-all duration-300 flex items-center justify-center font-bold text-lg active:scale-90 shadow-md"
                title="Semaine suivante"
              >
                →
              </button>
            </div>

            {/* BOUTON VERS TOUS LES RENDEZ-VOUS */}
            <Link
              to="/admin/rendez-vous"
              className="btn-badass bg-[#070709] text-white border border-black px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2.5 shadow-md active:scale-95"
              title="Consulter l'historique complet des rendez-vous"
            >
              <span className="text-sm">📋</span>
              <span>Tous les RDV</span>
            </Link>

            {/* BOUTON DE DÉCONNEXION DYNAMIQUE ET MODERNE */}
            <button
              onClick={handleLogout}
              className="btn-badass bg-white/80 hover:bg-red-500 hover:text-white text-[#070709] border border-black/10 hover:border-red-500 px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2.5 shadow-sm active:scale-95"
              title="Se déconnecter de la session admin"
            >
              <span className="text-sm">⎋</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* ENCADRÉ PROCHAINS RENDEZ-VOUS */}
        <div className="card-dash rounded-3xl p-6 mb-10 shadow-sm border border-black/10 bg-white/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-gray-600">
                Prochains rendez-vous
              </h3>
            </div>
            <Link 
              to="/admin/rendez-vous"
              className="text-[10px] font-extrabold text-black hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              Voir tout l'historique →
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium italic">Aucun rendez-vous à venir pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setEditingAppointment({ ...item })}
                  className="group relative bg-white/80 hover:bg-[#070709] hover:text-white p-4 rounded-2xl border border-black/5 hover:border-black transition-all duration-300 cursor-pointer flex items-center justify-between shadow-xs hover:shadow-lg"
                >
                  <div className="overflow-hidden">
                    <p className="font-serif font-bold text-sm truncate group-hover:text-white transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500 group-hover:text-gray-400 font-medium truncate">
                      {item.service || "Service non spécifié"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-black/5 group-hover:bg-white/10 text-[9px] font-bold group-hover:text-gray-200 transition-colors">
                      {item.date?.split("T")[0]} • {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LISTE DES JOURS (SEMAINE) AVEC ANIMATION DE TRANSITION */}
        <div className={`week-grid grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-10 ${isChangingWeek ? 'week-grid-animating' : ''}`}>
          {getWeekDays().map((day) => {
            const isSelected = selectedDay?.date === day.date;

            return (
              <button
                key={day.date}
                onClick={() => selectDay(day)}
                className={`
                  relative text-left p-5 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden
                  ${
                    isSelected
                      ? "bg-[#070709] text-white shadow-xl scale-[1.03] ring-2 ring-black"
                      : "card-dash hover:bg-white"
                  }
                `}
              >
                <div
                  className={`text-[9px] uppercase tracking-[0.25em] font-extrabold mb-3 ${
                    isSelected ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Jour
                </div>

                <div className="font-serif text-xl font-bold capitalize mb-1">
                  {day.name}
                </div>

                <div
                  className={`text-xs font-semibold ${
                    isSelected ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {day.date}
                </div>

                {isSelected && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-white shadow-glow" />
                )}
              </button>
            );
          })}
        </div>

        {/* AUCUN JOUR SÉLECTIONNÉ */}
        {!selectedDay && (
          <div className="card-dash rounded-[2.5rem] p-12 text-center shadow-lg my-12">
            <div className="w-16 h-16 rounded-full bg-[#070709] text-white flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-md">
              📅
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#070709] mb-2">
              Sélectionnez une journée
            </h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto font-light">
              Cliquez sur l'un des jours ci-dessus pour ouvrir les créneaux ou consulter les rendez-vous pris.
            </p>
          </div>
        )}

        {/* DETAIL DU JOUR SÉLECTIONNÉ */}
        {selectedDay && (
          <div className="card-dash rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/10">
            {/* ENTÊTE DU JOUR */}
            <div className="p-8 md:p-10 border-b border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-gray-600 font-extrabold block mb-1">
                  Planning du jour
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight capitalize text-[#070709]">
                  {selectedDay.name}
                </h2>
              </div>
              <div className="inline-block px-5 py-2 rounded-full bg-black/5 text-xs font-black tracking-widest text-gray-700 border border-black/10">
                {selectedDay.date}
              </div>
            </div>

            {/* GRILLE DES CRÉNEAUX */}
            <div className="p-6 md:p-8 space-y-4">
              {times.map((time) => {
                const active = isAvailable(selectedDay.date, time);
                const appointment = getAppointment(selectedDay.date, time);

                return (
                  <div key={time} className="transition-all duration-300">
                    {/* RENDEZ-VOUS EXISTANT */}
                    {appointment ? (
                      <div className="bg-[#070709] text-white rounded-2xl p-6 md:p-7 shadow-xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-transform hover:scale-[1.005]">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                          {/* HEURE */}
                          <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center sm:text-left shrink-0">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-extrabold block mb-0.5">
                              Heure
                            </span>
                            <span className="font-serif text-2xl font-bold">
                              {appointment.time}
                            </span>
                          </div>

                          {/* INFOS CLIENT */}
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-extrabold block mb-1">
                              Rendez-vous
                            </span>
                            <h3 className="font-serif text-2xl font-bold text-white mb-1">
                              {appointment.name}
                            </h3>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                              {appointment.service}
                            </span>
                          </div>

                          {/* CONTACT */}
                          <div className="sm:border-l border-white/10 sm:pl-6 text-xs text-gray-400 space-y-1">
                            <p className="font-semibold text-gray-300">📞 {appointment.phone}</p>
                            <p className="break-all font-light">✉️ {appointment.email}</p>
                          </div>
                        </div>

                        {/* BOUTON MODIFIER */}
                        <button
                          type="button"
                          onClick={() => setEditingAppointment({ ...appointment })}
                          className="px-6 py-3 rounded-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:bg-white hover:text-black active:scale-95 shrink-0"
                        >
                          Modifier
                        </button>
                      </div>
                    ) : (
                      /* CRÉNEAU DISPONIBLE OU FERMÉ */
                      <button
                        onClick={() => {
                          if (active) {
                            removeAvailability(selectedDay.date, time);
                          } else {
                            addAvailability(selectedDay.date, time);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                          active
                            ? "bg-white border-black/20 shadow-sm hover:border-black hover:shadow-md"
                            : "bg-black/[0.02] border-dashed border-black/10 hover:border-black/30 hover:bg-white/60"
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <span className="font-serif text-xl font-bold w-16 text-[#070709]">
                            {time}
                          </span>
                          <span className="w-px h-8 bg-black/10" />
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-extrabold block">
                              Statut du créneau
                            </span>
                            <span className={`text-sm font-bold ${active ? "text-black" : "text-gray-500"}`}>
                              {active ? "Créneau ouvert au public" : "Créneau fermé"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-500">
                            {active ? "Ouvert" : "Fermé"}
                          </span>
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                              active
                                ? "bg-[#070709] text-white shadow-md scale-105"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {active ? "✓" : "+"}
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODALE DE MODIFICATION */}
        {editingAppointment && (
          <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-lg card-dash rounded-[2.5rem] p-8 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto bg-white border border-black/10">
              
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.35em] text-gray-600 font-extrabold block mb-1">
                    Administration
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#070709]">
                    Modifier le RDV
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center font-bold text-lg hover:bg-black hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* NOM */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editingAppointment.name || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* TELEPHONE */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={editingAppointment.phone || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingAppointment.email || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* DATE */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingAppointment.date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* HEURE */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Heure
                  </label>
                  <select
                    value={editingAppointment.time || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        time: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  >
                    {times.map((timeOption) => (
                      <option key={timeOption} value={timeOption}>
                        {timeOption}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRESTATION */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                    Prestation
                  </label>
                  <input
                    type="text"
                    value={editingAppointment.service || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        service: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAFAF8] border border-black/10 p-3.5 rounded-xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="flex-1 border border-black/10 py-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={saveAppointment}
                    className="btn-badass flex-1 bg-[#070709] text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
                  >
                    Enregistrer
                  </button>
                </div>

                {/* SUPPRIMER */}
                <button
                  type="button"
                  onClick={deleteAppointment}
                  className="w-full border border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors mt-2"
                >
                  Supprimer le rendez-vous
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;