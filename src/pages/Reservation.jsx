import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function Reservation() {
  const allTimes = ["09h00", "10h00", "11h00", "14h00", "15h00"];

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [confirmation, setConfirmation] = useState(null);

  async function getServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true);

    if (error) {
      console.log("Erreur services :", error);
      return;
    }

    setServices(data || []);
  }

  useEffect(() => {
    getServices();

    const savedConfirmation = localStorage.getItem("vdo_barber_confirmation");

    if (savedConfirmation) {
      try {
        setConfirmation(JSON.parse(savedConfirmation));
      } catch (error) {
        localStorage.removeItem("vdo_barber_confirmation");
      }
    }
  }, []);

  async function getAvailableTimes(date) {
    if (!date) {
      setAvailableTimes([]);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", date);

    if (error) {
      console.log("Erreur horaires :", error);
      return;
    }

    const bookedTimes = (data || []).map((appointment) => appointment.time);

    const freeTimes = allTimes.filter((time) => !bookedTimes.includes(time));

    setAvailableTimes(freeTimes);
    setSelectedTime(null);
  }

  useEffect(() => {
    getAvailableTimes(selectedDate);
  }, [selectedDate]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedService) {
      alert("Veuillez choisir une prestation");
      return;
    }

    if (!selectedDate) {
      alert("Veuillez choisir une date");
      return;
    }

    if (!selectedTime) {
      alert("Veuillez choisir un horaire");
      return;
    }

    const appointment = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: selectedDate,
      time: selectedTime,
      service: selectedService.name,
      status: "confirmé",
    };

    const { error } = await supabase
      .from("appointments")
      .insert([appointment]);

    if (error) {
      console.log("Erreur réservation :", error);
      alert("Erreur lors de la réservation");
      return;
    }

    const confirmationData = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: selectedService.name,
      date: selectedDate,
      time: selectedTime,
    };

    localStorage.setItem(
      "vdo_barber_confirmation",
      JSON.stringify(confirmationData)
    );

    setConfirmation(confirmationData);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans pb-24">
      
      {/* STYLES & ANIMATIONS DE LUXE */}
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

        .card-lux {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-lux:hover {
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
          box-shadow: 0 15px 30px -10px rgba(7, 7, 9, 0.35);
        }

        .btn-badass:active {
          transform: translateY(1px) scale(0.97) !important;
        }
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 md:pt-16">
        
        {/* HEADER BRANDING */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-[9px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            Barber Premium
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#070709] mb-2">
            VDO <span className="italic font-light text-gray-500">Barber</span>
          </h1>

          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold">
            Modern Barbering • Réservez votre créneau
          </p>
        </div>

        {/* ECRAN DE CONFIRMATION */}
        {confirmation ? (
          <div className="card-lux rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden border border-black/10 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#070709] text-white flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-xl">
              ✓
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-black text-[#070709] mb-3">
              Rendez-vous Confirmé
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold mb-8">
              Merci {confirmation.name}
            </p>

            <div className="bg-[#FAFAF8] border border-black/5 rounded-2xl p-6 text-left space-y-3 mb-8 max-w-md mx-auto shadow-inner">
              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-extrabold">
                  Prestation
                </span>
                <span className="font-bold text-sm text-[#070709]">
                  {confirmation.service}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-extrabold">
                  Date
                </span>
                <span className="font-bold text-sm text-[#070709]">
                  {confirmation.date}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-extrabold">
                  Horaire
                </span>
                <span className="font-bold text-sm text-[#070709]">
                  {confirmation.time}
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs uppercase tracking-[0.25em] font-bold">
              À bientôt au Barber Club
            </p>

            <button
              onClick={() => {
                localStorage.removeItem("vdo_barber_confirmation");
                setConfirmation(null);
                setSelectedService(null);
                setSelectedDate("");
                setSelectedTime(null);
              }}
              className="mt-8 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold underline hover:text-black transition-colors"
            >
              Faire une autre réservation
            </button>
          </div>
        ) : (
          /* PARCOURS DE RÉSERVATION EN ÉTAPES */
          <div className="space-y-10">
            
            {/* ETAPE 1 : SELECTION DU SERVICE */}
            <section className="card-lux rounded-[2.5rem] p-8 md:p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-full bg-[#070709] text-white text-xs font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#070709]">
                  Choisissez votre prestation
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((service) => {
                  const isSelected = selectedService?.id === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`
                        w-full p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center justify-between gap-4
                        ${
                          isSelected
                            ? "bg-[#070709] text-white border-black shadow-xl scale-[1.01]"
                            : "bg-[#FAFAF8] text-[#070709] border-black/10 hover:border-black/30 hover:bg-white"
                        }
                      `}
                    >
                      <div>
                        <h3 className="font-serif text-xl font-bold mb-1">
                          {service.name}
                        </h3>
                        <p className={`text-xs font-semibold ${isSelected ? "text-gray-400" : "text-gray-500"}`}>
                          ⏱️ {service.duration} minutes
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif text-2xl font-black">
                          {service.price} €
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ETAPE 2 : SELECTION DE LA DATE */}
            {selectedService && (
              <section className="card-lux rounded-[2.5rem] p-8 md:p-10 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#070709] text-white text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#070709]">
                    Choisissez votre date
                  </h2>
                </div>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black font-semibold text-sm outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white shadow-sm"
                />
              </section>
            )}

            {/* ETAPE 3 : SELECTION DE L'HORAIRE */}
            {selectedDate && (
              <section className="card-lux rounded-[2.5rem] p-8 md:p-10 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#070709] text-white text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#070709]">
                    Horaires disponibles
                  </h2>
                </div>

                {availableTimes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTimes.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-4 px-3 rounded-2xl font-serif text-lg font-bold border transition-all duration-300 cursor-pointer text-center
                            ${
                              isSelected
                                ? "bg-[#070709] text-white border-black shadow-lg scale-105"
                                : "bg-[#FAFAF8] text-[#070709] border-black/10 hover:border-black/30 hover:bg-white"
                            }
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 font-semibold text-sm">
                    Aucun créneau disponible pour cette date.
                  </div>
                )}
              </section>
            )}

            {/* ETAPE 4 : FORMULAIRE ET VALIDATION */}
            {selectedTime && (
              <section className="card-lux rounded-[2.5rem] p-8 md:p-10 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#070709] text-white text-xs font-black flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-black text-[#070709]">
                    Vos informations
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black font-medium text-sm outline-none transition-all duration-300 focus:border-black focus:bg-white shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="06 12 34 56 78"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black font-medium text-sm outline-none transition-all duration-300 focus:border-black focus:bg-white shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-1.5">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jean.dupont@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black font-medium text-sm outline-none transition-all duration-300 focus:border-black focus:bg-white shadow-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-badass w-full bg-[#070709] text-white py-5 rounded-2xl uppercase tracking-[0.25em] text-xs font-black shadow-xl mt-4"
                  >
                    Confirmer mon rendez-vous
                  </button>
                </form>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Reservation;