import React from "react";

function Prestations() {
  const coupes = [
    {
      name: "Burst Fade",
      price: "15 €",
      description:
        "Un dégradé arrondi autour de l’oreille pour un style moderne, marqué et tendance.",
      image: "/images/burst-fade.jpg"
    },
    {
      name: "Taper Fade",
      price: "15 €",
      description:
        "Un dégradé discret sur les tempes et la nuque pour une finition propre et élégante.",
      image: "/images/taper-fade.jpg"
    },
    {
      name: "Mid Fade",
      price: "15 €",
      description:
        "Un dégradé intermédiaire qui apporte un équilibre parfait entre volume et précision.",
      image: "/images/mid-fade.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans">

      {/* DÉFINITION DES STYLES ET ANIMATIONS ULTRA-MODERNES */}
      <style>{`
        @keyframes rotateSlow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes marqueeSlow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes lightSweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }

        .anim-rotate { animation: rotateSlow 25s linear infinite; }
        .anim-marquee { animation: marqueeSlow 18s linear infinite; }

        /* Carte de luxe interactive */
        .card-luxury {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover {
          transform: translateY(-12px);
          background: rgba(255, 255, 255, 1);
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.1);
        }

        /* Zoom dynamique sur image */
        .img-zoom {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover .img-zoom {
          transform: scale(1.08);
        }

        /* Animation badge prix */
        .price-badge {
          background: #070709;
          color: #FFFFFF;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover .price-badge {
          transform: scale(1.1) rotate(-3deg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        /* Animation flèche interactive */
        .arrow-btn {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover .arrow-btn {
          transform: translate(4px, -4px) scale(1.1);
          background-color: #070709;
          color: #FFFFFF;
        }

        /* Animation des Boutons de Réservation */
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
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 20px 40px -10px rgba(7, 7, 9, 0.35);
        }

        .btn-badass:active {
          transform: translateY(2px) scale(0.93) !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ & DYNAMIQUE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-black/[0.025] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[65vh] flex flex-col justify-center items-center text-center px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-md text-[10px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-8 transition-transform duration-300 hover:scale-105 cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          Haute Coiffure • VDO Barber
        </div>

        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-none text-[#070709]">
          L'art <span className="text-transparent bg-clip-text bg-gradient-to-b from-black via-gray-700 to-gray-400 italic font-light block sm:inline">du Fade</span>
        </h1>

        <p className="max-w-xl text-gray-600 text-sm md:text-base font-light tracking-wide mt-8 leading-relaxed">
          Découvrez nos différentes techniques de dégradé, réalisées avec précision et exigence pour s'adapter parfaitement à votre style.
        </p>
      </section>

      {/* BANDEAU DÉFILANT MARQUEE */}
      <div className="relative z-10 py-5 border-y border-black/10 bg-black/[0.02] overflow-hidden whitespace-nowrap mb-20">
        <div className="inline-block anim-marquee">
          <span className="text-xl md:text-3xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">BURST FADE</span>
          <span className="text-xl md:text-3xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-xl md:text-3xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">TAPER FADE</span>
          <span className="text-xl md:text-3xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-xl md:text-3xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">MID FADE</span>
          <span className="text-xl md:text-3xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-xl md:text-3xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">BURST FADE</span>
          <span className="text-xl md:text-3xl font-serif italic text-black/50 mx-8">·</span>
        </div>
      </div>

      {/* SECTION GRILLE DE COUPES & PRESTATIONS */}
      <section className="relative z-10 px-6 md:px-12 pb-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {coupes.map((coupe, index) => (
            <div
              key={index}
              className="card-luxury rounded-[2.5rem] overflow-hidden flex flex-col justify-between group relative"
            >
              {/* VISUEL / IMAGE */}
              <div className="relative h-[400px] md:h-[440px] overflow-hidden bg-gray-200">
                <img
                  src={coupe.image}
                  alt={coupe.name}
                  className="img-zoom w-full h-full object-cover"
                />

                {/* OVERLAY DE VIGNETTAGE AU HOVER */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                {/* NUMÉRO DE STYLE */}
                <div className="absolute top-6 left-6">
                  <div className="price-badge px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase">
                    0{index + 1}
                  </div>
                </div>

                {/* BOUTON FLÈCHE INTERACTIF */}
                <a
                  href="/reservation"
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black font-bold text-lg shadow-lg arrow-btn"
                >
                  ↗
                </a>

                {/* BADGE PRIX FIXÉ SUR L'IMAGE */}
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-black font-black text-lg px-5 py-2 rounded-full shadow-lg">
                    {coupe.price}
                  </span>
                </div>
              </div>

              {/* CONTENU TEXTE */}
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-black/40 group-hover:bg-black transition-colors" />
                    <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-extrabold">
                      Coiffure
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-bold mb-4 text-[#070709] transition-transform duration-300 group-hover:translate-x-1">
                    {coupe.name}
                  </h3>

                  <p className="text-gray-600 text-sm font-light leading-relaxed mb-8">
                    {coupe.description}
                  </p>
                </div>

                {/* CTA DE RÉSERVATION DANS LA CARTE */}
                <a
                  href="/reservation"
                  className="btn-badass w-full bg-[#070709] text-white text-center text-[10px] font-black uppercase tracking-[0.25em] py-4 rounded-xl shadow-lg"
                >
                  Réserver ce style
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION CTA BANNIÈRE NOIRE NOCTURNE */}
      <section className="relative z-10 py-32 px-6 bg-[#070709] text-white text-center overflow-hidden">
        {/* CERCLES DÉCORATIFS */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10 animate-ping opacity-20" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gray-400 font-extrabold block mb-6">
            Haute Précision
          </span>

          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            Votre prochain <br />
            <span className="italic font-light text-gray-400">style commence ici</span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base font-light mb-12 max-w-lg mx-auto leading-relaxed">
            Choisissez la coupe qui vous ressemble et réservez votre créneau en quelques clics chez VDO Barber.
          </p>

          <a
            href="/reservation"
            className="btn-badass inline-block bg-white text-black font-black text-xs uppercase tracking-[0.3em] px-12 py-5 rounded-2xl shadow-2xl hover:bg-gray-200"
          >
            Réserver mon rendez-vous
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-black/10 py-10 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
          <p className="hover:text-black transition-colors cursor-default">VDO Barber Studio</p>
          <p className="hover:text-black transition-colors cursor-default">Victor.</p>
        </div>
      </footer>

    </div>
  );
}

export default Prestations;