import React, { useState, useEffect } from "react";

function Home() {
  // Gestion de l'apparition/disparition au scroll
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si on défile vers le bas et qu'on a dépassé 100px de scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomBar(true);
      } 
      // Si on remonte
      else if (currentScrollY < lastScrollY) {
        setShowBottomBar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] overflow-hidden relative selection:bg-black selection:text-white font-sans">

      {/* DÉFINITION DES CSS ET ANIMATIONS SUR-MESURE */}
      <style>{`
        @keyframes subtleRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
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

        .anim-rotate { animation: subtleRotate 25s linear infinite; }
        .anim-marquee { animation: marqueeSlow 18s linear infinite; }

        /* Effet Carte de Luxe avec Bordure Interactive (Thème Clair) */
        .card-luxury {
          background: rgba(0, 0, 0, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.25);
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08), 0 0 40px rgba(0, 0, 0, 0.03);
        }

        .price-badge {
          background: #070709;
          color: #FFFFFF;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-luxury:hover .price-badge {
          transform: scale(1.12) rotate(-4deg);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
        }

        /* ANIMATION BOUTONS QUI DÉCHIRE (EXPLOSIVE & ÉLÉGANTE) */
        .btn-badass {
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          user-select: none;
        }

        /* Balayage néon de lumière au survol */
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
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 20px 40px -10px rgba(7, 7, 9, 0.35);
        }

        .btn-badass:active {
          transform: translateY(2px) scale(0.93) !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
          transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Variante Bouton Secondaire (Outline/Card) */
        .btn-badass-secondary {
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          user-select: none;
        }

        .btn-badass-secondary:hover {
          transform: translateY(-4px) scale(1.04);
          background: rgba(7, 7, 9, 0.05);
          border-color: rgba(7, 7, 9, 0.4);
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.12);
        }

        .btn-badass-secondary:active {
          transform: translateY(2px) scale(0.93) !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ & DYNAMIQUE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-black/[0.03] rounded-full blur-[150px] anim-rotate" />
        
        {/* Pattern de fond type maillage minimaliste */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* BANDEAU FLOTTANT EN BAS */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg transition-all duration-500 ease-in-out ${
          showBottomBar 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        <div className="card-luxury rounded-full px-6 py-3.5 flex items-center justify-between border border-black/15 shadow-2xl bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span className="font-serif font-black tracking-widest text-xs uppercase">VDO Barber</span>
          </div>
          <a
            href="/reservation"
            className="btn-badass bg-[#070709] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-xl"
          >
            Réserver
          </a>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-16">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-md text-[10px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-8 transition-transform duration-300 hover:scale-105 cursor-default">
          Haute Coiffure Masculine
        </div>

        <h1 className="font-serif text-7xl sm:text-9xl md:text-[12rem] font-black uppercase tracking-tighter leading-none text-[#070709]">
          VDO <span className="text-transparent bg-clip-text bg-gradient-to-b from-black via-gray-700 to-gray-400 italic font-light block sm:inline">Barber</span>
        </h1>

        <p className="max-w-xl text-gray-600 text-sm md:text-base font-light tracking-wide mt-8 leading-relaxed">
          Un espace dédié à l'élégance masculine, où chaque détail est pensé pour offrir une expérience unique.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 mt-12 w-full max-w-md">
          <a
            href="/reservation"
            className="btn-badass w-full sm:w-1/2 bg-[#070709] text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-2xl text-center"
          >
            Réserver
          </a>
          <a
            href="#tarifs"
            className="btn-badass-secondary w-full sm:w-1/2 card-luxury text-[#070709] font-extrabold text-xs uppercase tracking-[0.2em] py-5 rounded-2xl text-center"
          >
            Voir les tarifs
          </a>
        </div>

      </section>

      {/* MARQUEE DÉFILANT */}
      <div className="relative z-10 py-5 border-y border-black/10 bg-black/[0.02] overflow-hidden whitespace-nowrap">
        <div className="inline-block anim-marquee">
          <span className="text-2xl md:text-4xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">COUPE 15€</span>
          <span className="text-2xl md:text-4xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-2xl md:text-4xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">COUPE + BARBE 20€</span>
          <span className="text-2xl md:text-4xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-2xl md:text-4xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">TRANSFORMATION 20€</span>
          <span className="text-2xl md:text-4xl font-serif italic text-black/50 mx-8">·</span>
          <span className="text-2xl md:text-4xl font-serif font-black uppercase tracking-widest text-black/20 mx-8">COUPE 15€</span>
          <span className="text-2xl md:text-4xl font-serif italic text-black/50 mx-8">·</span>
        </div>
      </div>

      {/* SECTION PHILOSOPHIE */}
      <section id="philosophie" className="relative z-10 py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <span className="text-xs uppercase tracking-[0.5em] text-gray-500 font-extrabold block mb-4">01 // PHILOSOPHIE</span>
            <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-[#070709]">
              L'art <br />
              <span className="italic font-light text-gray-500">du détail</span>
            </h2>
          </div>

          <div className="card-luxury p-10 rounded-[2.5rem]">
            <p className="text-lg text-gray-700 font-light leading-relaxed">
              Chez VDO Barber, chaque prestation est réalisée avec précision et exigence. Notre objectif : proposer une expérience masculine élégante dans un environnement moderne et raffiné.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION SERVICES & TARIFS */}
      <section id="tarifs" className="relative z-10 py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.5em] text-gray-500 font-extrabold block mb-4">02 // MENU & TARIFS</span>
              <h2 className="font-serif text-6xl md:text-8xl font-black text-[#070709]">Prestations</h2>
            </div>
            <p className="text-gray-600 text-sm max-w-sm uppercase tracking-wider font-light">
              Des prestations pensées pour révéler votre style et mettre chaque détail en valeur.
            </p>
          </div>

          {/* GRILLE DE CARTE DES PRIX */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* SERVICE 1 : COUPE */}
            <div className="card-luxury p-10 rounded-[2.5rem] flex flex-col justify-between min-h-[440px] relative overflow-hidden group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">01</span>
                  <div className="price-badge px-5 py-2.5 rounded-full font-black text-xl shadow-lg">
                    15 €
                  </div>
                </div>

                <h3 className="font-serif text-3xl font-bold mt-8 mb-4 text-[#070709] transition-transform duration-300 group-hover:translate-x-1">Coupe</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Une coupe personnalisée adaptée à votre style, avec un travail précis des longueurs, des volumes et des finitions pour un résultat soigné.
                </p>
              </div>

              <a href="/reservation" className="btn-badass-secondary p-4 -mx-4 rounded-xl pt-6 border-t border-black/10 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-600 group-hover:text-black">
                <span className="group-hover:tracking-[0.2em] transition-all duration-300">Réservation</span>
                <span className="text-lg group-hover:translate-x-3 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* SERVICE 2 : COUPE + BARBE */}
            <div className="card-luxury p-10 rounded-[2.5rem] flex flex-col justify-between min-h-[440px] relative overflow-hidden group bg-black/5 border-black/30 shadow-xl md:-translate-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-700 font-bold">02 // POPULAIRE</span>
                  <div className="price-badge px-5 py-2.5 rounded-full font-black text-xl shadow-lg">
                    20 €
                  </div>
                </div>

                <h3 className="font-serif text-3xl font-bold mt-8 mb-4 text-[#070709] transition-transform duration-300 group-hover:translate-x-1">Coupe + Barbe</h3>
                <p className="text-gray-800 text-sm font-light leading-relaxed">
                  Une prestation complète pour harmoniser la coupe de cheveux et la barbe, avec un travail précis des longueurs, des volumes et des contours pour un style soigné.
                </p>
              </div>

              <a href="/reservation" className="btn-badass-secondary p-4 -mx-4 rounded-xl pt-6 border-t border-black/20 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#070709]">
                <span className="group-hover:tracking-[0.2em] transition-all duration-300">Réservation</span>
                <span className="text-lg group-hover:translate-x-3 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* SERVICE 3 : TRANSFORMATION */}
            <div className="card-luxury p-10 rounded-[2.5rem] flex flex-col justify-between min-h-[440px] relative overflow-hidden group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">03</span>
                  <div className="price-badge px-5 py-2.5 rounded-full font-black text-xl shadow-lg">
                    20 €
                  </div>
                </div>

                <h3 className="font-serif text-3xl font-bold mt-8 mb-4 text-[#070709] transition-transform duration-300 group-hover:translate-x-1">Coupe Transformation</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  C’est une coupe réalisée après environ 2 mois de pousse pour pouvoir restructurer la chevelure. Elle permet de modifier la forme, la longueur et le volume afin de créer un nouveau style.
                </p>
              </div>

              <a href="/reservation" className="btn-badass-secondary p-4 -mx-4 rounded-xl pt-6 border-t border-black/10 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-600 group-hover:text-black">
                <span className="group-hover:tracking-[0.2em] transition-all duration-300">Réservation</span>
                <span className="text-lg group-hover:translate-x-3 transition-transform duration-300">→</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION RÉSERVATION / CTA FINAL */}
      <section className="relative z-10 py-36 px-6 text-center border-t border-black/10">
        <div className="max-w-3xl mx-auto">
          
          <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tight mb-8 text-[#070709]">
            Prenez rendez-vous <br />
            <span className="italic font-light text-gray-500">chez VDO Barber</span>
          </h2>

          <p className="text-gray-600 text-base font-light mb-12">
            Réservez votre expérience premium en quelques secondes.
          </p>

          <a
            href="/reservation"
            className="btn-badass inline-block bg-[#070709] text-white font-black text-xs uppercase tracking-[0.3em] px-14 py-6 rounded-2xl shadow-2xl"
          >
            Réserver
          </a>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-black/10 py-10 px-6 md:px-16 bg-white/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
          <p className="hover:text-black transition-colors cursor-default">VDO Barber Studio</p>
          <p className="hover:text-black transition-colors cursor-default">Victor.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;