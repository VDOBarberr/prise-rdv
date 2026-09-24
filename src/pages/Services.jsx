import React from "react";

// Extraction du CSS hors du rendu React pour des performances optimales
const STYLES = `
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

  /* Carte de luxe interactive */
  .card-luxury {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
    will-change: transform;
  }

  .card-luxury:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.08);
  }

  /* Zoom sur image */
  .img-zoom {
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }

  .card-luxury:hover .img-zoom {
    transform: scale(1.06);
  }

  /* Animation flèche interactive */
  .arrow-btn {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, color 0.4s ease;
    will-change: transform;
  }

  .card-luxury:hover .arrow-btn {
    transform: translate(4px, -4px) scale(1.1);
    background-color: #070709;
    color: #FFFFFF;
  }

  /* Bouton d'action interactif */
  .btn-badass {
    position: relative;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
    user-select: none;
    will-change: transform;
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
    transform: translateY(1px) scale(0.96) !important;
  }
`;

const PRESTATIONS = [
  {
    id: "coupe-signature",
    image: "/images/coupe.jpg",
    title: "Coupe Signature",
    description: "Une coupe personnalisée avec dégradé, contours précis et finition professionnelle.",
    price: "30 €"
  },
  {
    id: "taille-barbe",
    image: "/images/barbe.jpg",
    title: "Taille de barbe",
    description: "Restructuration de la barbe, traçage des contours et soin adapté.",
    price: "20 €"
  },
  {
    id: "coupe-barbe",
    image: "/images/coupe-barbe.jpg",
    title: "Coupe + Barbe",
    description: "L'expérience complète VDO Barber : coupe moderne et barbe parfaitement travaillée.",
    price: "45 €"
  },
  {
    id: "coupe-enfant",
    image: "/images/enfant.jpg",
    title: "Coupe Enfant",
    description: "Une coupe adaptée aux plus jeunes dans une ambiance détendue.",
    price: "20 €"
  }
];

function Services() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans">
      
      <style>{STYLES}</style>

      {/* ARRIÈRE-PLAN ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[50vh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-md text-[10px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-8 transition-transform duration-300 hover:scale-105 cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          Menu des Prestations • VDO Barber
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-[#070709] mb-6">
          Nos <span className="italic font-light text-gray-500">Prestations</span>
        </h1>

        <p className="max-w-xl text-gray-600 text-sm md:text-base font-light tracking-wide leading-relaxed">
          L'expertise VDO Barber alliée au savoir-faire traditionnel pour vous offrir un style unique et soigné.
        </p>
      </section>

      {/* GRILLE DES SERVICES */}
      <section className="relative z-10 px-6 md:px-12 pb-28 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {PRESTATIONS.map((item) => (
            <div
              key={item.id}
              className="card-luxury rounded-[2.5rem] overflow-hidden flex flex-col justify-between group relative"
            >
              {/* VISUEL / IMAGE */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="img-zoom w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* OVERLAY AU HOVER */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                {/* BOUTON FLÈCHE INTERACTIF */}
                <a
                  href="/reservation"
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black font-bold text-lg shadow-lg arrow-btn"
                  aria-label={`Réserver ${item.title}`}
                >
                  ↗
                </a>

                {/* BADGE PRIX SUR L'IMAGE */}
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-black font-black text-lg px-5 py-2 rounded-full shadow-lg">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* CONTENU TEXTE */}
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2 h-2 rounded-full bg-black/40 group-hover:bg-black transition-colors" />
                    <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-extrabold">
                      Barber Care
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl font-bold mb-3 text-[#070709] transition-transform duration-300 group-hover:translate-x-1">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 text-sm font-light leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                {/* CTA DE RÉSERVATION */}
                <a
                  href="/reservation"
                  className="btn-badass w-full bg-[#070709] text-white text-center text-[10px] font-black uppercase tracking-[0.25em] py-4 rounded-xl shadow-lg"
                >
                  Réserver ce soin
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNIÈRE BANDEAU CTA */}
      <section className="relative z-10 py-24 px-6 bg-[#070709] text-white text-center overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl font-black tracking-tight mb-6">
            Prêt à réserver <br />
            <span className="italic font-light text-gray-400">votre séance ?</span>
          </h2>

          <p className="text-gray-400 text-sm font-light mb-10 leading-relaxed">
            Choisissez la prestation idéale et sélectionnez le créneau horaire qui vous convient.
          </p>

          <a
            href="/reservation"
            className="btn-badass inline-block bg-white text-black font-black text-xs uppercase tracking-[0.3em] px-10 py-5 rounded-2xl shadow-2xl hover:bg-gray-200"
          >
            Prendre rendez-vous
          </a>
        </div>
      </section>

    </div>
  );
}

export default Services;