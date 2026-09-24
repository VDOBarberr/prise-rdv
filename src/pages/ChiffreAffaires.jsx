import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

// 🏷️ TARIFAIRE DE TES PRESTATIONS
const TARIFS_SERVICES = {
  // Prestations ajoutées / mises à jour
  "Coupe + Barbe": 20,
  "Coupe": 15,
  "Coupe Transformation": 20,

  
  
  // Esthétique / Onglerie / Ongles
  "Pose Américaine": 45,
  "Gainage VSP": 35,
  "Remplissage VSP": 30,
  "Pose Vernis Semi-Permanent": 25,
  "Dépose": 10,
  "Nail Art": 5,
};

function ChiffreAffaires() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statsMonth, setStatsMonth] = useState([]);
  const [totalYear, setTotalYear] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFinancialData = useCallback(async () => {
    setLoading(true);

    try {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("date", `${selectedYear}-01-01`)
        .lte("date", `${selectedYear}-12-31`);

      if (error) throw error;

      const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      const monthlyTotals = Array(12).fill(0);
      const monthlyCounts = Array(12).fill(0);
      let yearSum = 0;

      (appointments || []).forEach((item) => {
        if (item.status === "Annulé") return;

        if (item.date) {
          const dateObj = new Date(item.date);
          const monthIndex = dateObj.getMonth();

          let priceNum = 0;

          const rawPrice = item.price ?? item.prix ?? item.amount ?? item.total;
          if (typeof rawPrice === "number" && rawPrice > 0) {
            priceNum = rawPrice;
          } else if (typeof rawPrice === "string") {
            priceNum = parseFloat(rawPrice.replace(/[^0-9,-]/g, "").replace(",", ".")) || 0;
          }

          if (priceNum === 0 && item.service) {
            const serviceName = item.service.trim();
            
            if (TARIFS_SERVICES[serviceName] !== undefined) {
              priceNum = TARIFS_SERVICES[serviceName];
            } else {
              const foundKey = Object.keys(TARIFS_SERVICES).find((key) =>
                serviceName.toLowerCase().includes(key.toLowerCase())
              );
              if (foundKey) {
                priceNum = TARIFS_SERVICES[foundKey];
              }
            }
          }

          monthlyTotals[monthIndex] += priceNum;
          monthlyCounts[monthIndex] += 1;
          yearSum += priceNum;
        }
      });

      const formattedStats = months.map((monthName, index) => ({
        month: monthName,
        total: monthlyTotals[index],
        count: monthlyCounts[index],
      }));

      setStatsMonth(formattedStats);
      setTotalYear(yearSum);
    } catch (err) {
      console.error("Erreur lors du calcul du CA :", err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] p-6 md:p-12 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/admin"
              className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-2 inline-block"
            >
              ← Retour au planning
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Chiffre d'Affaires
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-black/10 shadow-sm">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="w-10 h-10 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              ←
            </button>
            <span className="font-bold text-sm px-4">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="w-10 h-10 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* TOTAL ANNUEL */}
        <div className="bg-[#070709] text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-extrabold block mb-2">
            Total annuel ({selectedYear})
          </span>
          <div className="text-5xl md:text-6xl font-black">
            {loading ? "..." : `${totalYear.toLocaleString("fr-FR")} €`}
          </div>
        </div>

        {/* DETAILS MENSUELS */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-black/10 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Détail par mois</h2>

          {loading ? (
            <p className="text-gray-500 text-sm italic">Chargement des données...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statsMonth.map((stat) => (
                <div
                  key={stat.month}
                  className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/5 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-base">{stat.month}</h3>
                    <p className="text-xs text-gray-500">
                      {stat.count} prestations enregistrées
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-lg text-[#070709]">
                      {stat.total.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ChiffreAffaires;