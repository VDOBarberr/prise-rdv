import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  
  // Options de tri : 'created-desc', 'created-asc', 'name-asc', 'name-desc'
  const [sortBy, setSortBy] = useState("created-desc");

  const times = [
    "09h00", "10h00", "11h00", "12h00", "13h00",
    "14h00", "15h00", "16h00", "17h00", "18h00"
  ];

  async function fetchAppointments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*");

    if (error) {
      console.error("Erreur chargement rendez-vous :", error);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  // FILTRAGE ET TRI
  const processedAppointments = appointments
    .filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.includes(query) ||
        item.service?.toLowerCase().includes(query) ||
        item.date?.includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "created-desc") {
        const dateA = new Date(a.created_at || a.id);
        const dateB = new Date(b.created_at || b.id);
        return dateB - dateA;
      } 
      if (sortBy === "created-asc") {
        const dateA = new Date(a.created_at || a.id);
        const dateB = new Date(b.created_at || b.id);
        return dateA - dateB;
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      return 0;
    });

  // MODIFICATION
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
    await fetchAppointments();
  }

  // SUPPRESSION
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
    await fetchAppointments();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#070709] font-sans p-4 sm:p-8 md:p-12 pb-32 relative selection:bg-black selection:text-white">
      
      {/* EFFETS DE FOND ACCENTUÉS ET MODERNES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/30 to-blue-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/40 to-rose-100/30 rounded-full blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
          <div>
            <Link
              to="/admin"
              className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black mb-4 transition-all duration-300"
            >
              <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>Retour au planning</span>
            </Link>
            
            <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#070709]">
              Historique <span className="italic font-light text-gray-400">Global</span>
            </h1>
          </div>

          {/* BADGES STATISTIQUES EN EN-TÊTE */}
          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-black/10 shadow-sm flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold block">
                  Total
                </span>
                <span className="text-sm font-black tracking-tight">
                  {appointments.length} RDV
                </span>
              </div>
            </div>

            <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold block">
                  Filtrés
                </span>
                <span className="text-sm font-black tracking-tight">
                  {processedAppointments.length} affiché(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BARRE D'OUTILS ET DE RECHERCHE ULTRA-PRATIQUE */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/10 p-3 sm:p-4 rounded-3xl shadow-xl shadow-black/[0.02] space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
          
          {/* BARRE DE RECHERCHE */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher par client, téléphone, prestation, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F4F6] focus:bg-white border border-transparent focus:border-black/20 pl-11 pr-10 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/10 hover:bg-black hover:text-white text-xs font-bold transition-all flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* MENU DÉROULANT DE TRI */}
          <div className="flex items-center gap-2 bg-[#F4F4F6] border border-transparent hover:border-black/10 px-4 py-2 rounded-2xl transition-all shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trier :
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-black uppercase tracking-wider text-[#070709] outline-none cursor-pointer py-1.5"
            >
              <option value="created-desc">⚡ Prise de RDV : Récent → Ancien</option>
              <option value="created-asc">⚡ Prise de RDV : Ancien → Récent</option>
              <option value="name-asc">🔤 Prénom / Nom : A → Z</option>
              <option value="name-desc">🔤 Prénom / Nom : Z → A</option>
            </select>
          </div>
        </div>

        {/* LISTE DES RENDEZ-VOUS SUR CARTE ULTRA-MODERNE */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Chargement des données...
            </p>
          </div>
        ) : processedAppointments.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-16 text-center border border-black/10 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto text-2xl">
              📂
            </div>
            <p className="text-sm font-bold text-gray-600">
              Aucun rendez-vous ne correspond à vos critères.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-black uppercase tracking-wider text-black underline hover:opacity-70 transition-opacity"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-black/10 shadow-2xl shadow-black/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 text-[9px] uppercase tracking-[0.25em] font-extrabold text-gray-400 bg-black/[0.01]">
                    <th className="py-5 px-6">Client</th>
                    <th className="py-5 px-6">Coordonnées</th>
                    <th className="py-5 px-6">Prestation</th>
                    <th className="py-5 px-6">RDV Prévu</th>
                    <th className="py-5 px-6 text-right">Gestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-xs font-medium">
                  {processedAppointments.map((item) => (
                    <tr 
                      key={item.id} 
                      className="group hover:bg-black/[0.02] transition-colors duration-200"
                    >
                      {/* NOM CLIENT */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-black/5 group-hover:bg-black group-hover:text-white transition-colors duration-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-base text-[#070709] group-hover:translate-x-0.5 transition-transform">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="py-5 px-6 text-gray-600 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                          <span className="text-[10px] text-gray-400">📞</span>
                          <span>{item.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-light">
                          <span>✉️</span>
                          <span>{item.email}</span>
                        </div>
                      </td>

                      {/* PRESTATION */}
                      <td className="py-5 px-6">
                        <span className="inline-block px-3.5 py-1.5 rounded-xl bg-black/5 group-hover:bg-black/10 text-[10px] font-black text-gray-800 uppercase tracking-wider transition-colors">
                          {item.service || "Non précisé"}
                        </span>
                      </td>

                      {/* DATE DU RDV */}
                      <td className="py-5 px-6">
                        <div className="inline-flex flex-col">
                          <span className="font-bold text-sm text-[#070709]">
                            {item.date?.split("T")[0]}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                            à {item.time}
                          </span>
                        </div>
                      </td>

                      {/* ACTION / MODIFIER */}
                      <td className="py-5 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingAppointment({ ...item })}
                          className="px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black hover:text-white border border-black/5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 shadow-xs active:scale-95"
                        >
                          Éditer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODALE DE MODIFICATION DESIGN HAUT DE GAMME */}
        {editingAppointment && (
          <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div className="w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto bg-white border border-black/10 relative">
              
              {/* HEADER MODALE */}
              <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.35em] text-gray-400 font-black block mb-1">
                    Édition Rapide
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#070709]">
                    Modifier le RDV
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="w-10 h-10 rounded-full bg-black/5 hover:bg-black hover:text-white flex items-center justify-center font-bold text-base transition-all duration-300 active:scale-90"
                >
                  ✕
                </button>
              </div>

              {/* FORMULAIRE */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={editingAppointment.name || ""}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, name: e.target.value })}
                    className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editingAppointment.phone || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, phone: e.target.value })}
                      className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingAppointment.email || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, email: e.target.value })}
                      className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingAppointment.date?.split("T")[0] || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                      className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                      Heure
                    </label>
                    <select
                      value={editingAppointment.time || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                      className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                    >
                      {times.map((timeOption) => (
                        <option key={timeOption} value={timeOption}>{timeOption}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-black mb-1.5">
                    Prestation
                  </label>
                  <input
                    type="text"
                    value={editingAppointment.service || ""}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, service: e.target.value })}
                    className="w-full bg-[#F8F8FA] border border-black/10 p-3.5 rounded-2xl text-xs font-semibold outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* BOUTONS D'ACTION */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="flex-1 border border-black/10 py-4 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={saveAppointment}
                    className="flex-1 bg-[#070709] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Sauvegarder
                  </button>
                </div>

                <button
                  type="button"
                  onClick={deleteAppointment}
                  className="w-full border border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 mt-2"
                >
                  Supprimer ce rendez-vous
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AllAppointments;