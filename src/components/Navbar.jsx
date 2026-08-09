import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Détection du scroll pour ajuster l'ombre de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu mobile automatiquement lors d'un changement de page
  const closeMenu = () => setMobileMenuOpen(false);

  // Vérifie si le lien est la page active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        /* Animation du shimmer sur le bouton réserver */
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .btn-reserve {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-reserve::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: translateX(-100%);
        }

        .btn-reserve:hover::after {
          animation: shine 0.85s ease-in-out;
        }

        .btn-reserve:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .btn-reserve:active {
          transform: translateY(1px) scale(0.96);
        }
      `}</style>

      {/* NAVBAR PRINCIPALE */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-black/5 ${
          isScrolled ? "shadow-md py-3.5" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex flex-col items-start group"
          >
            <span className="font-serif font-black text-2xl md:text-3xl tracking-[0.25em] text-[#070709] transition-transform duration-300 group-hover:scale-105">
              VDO
            </span>
            <span className="text-[9px] uppercase tracking-[0.5em] text-gray-500 font-bold -mt-1 group-hover:text-black transition-colors">
              Barber Studio
            </span>
          </Link>

          {/* LIENS DESKTOP (ORDINATEUR) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-xs uppercase tracking-[0.2em] font-extrabold transition-all relative py-1 ${
                isActive('/') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Accueil
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </Link>

            <Link
              to="/prestations"
              className={`text-xs uppercase tracking-[0.2em] font-extrabold transition-all relative py-1 ${
                isActive('/prestations') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Prestations
              {isActive('/prestations') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </Link>

            <Link
              to="/mes-rendez-vous"
              className={`text-xs uppercase tracking-[0.2em] font-extrabold transition-all relative py-1 ${
                isActive('/mes-rendez-vous') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Mes rendez-vous
              {isActive('/mes-rendez-vous') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </Link>

            <Link
              to="/admin"
              className={`text-xs uppercase tracking-[0.2em] font-extrabold transition-all relative py-1 ${
                isActive('/admin') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              Admin
              {isActive('/admin') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </Link>

            {/* BOUTON RÉSERVER */}
            <Link
              to="/reservation"
              className="btn-reserve bg-[#070709] text-white text-[11px] font-black uppercase tracking-[0.25em] px-7 py-3 rounded-full shadow-lg ml-2"
            >
              Réserver
            </Link>
          </nav>

          {/* BOUTON BURGER (TELEPHONE) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <div className="w-5 flex flex-col items-center gap-1.5">
              <span
                className={`w-full h-[2px] bg-black rounded-full transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`w-full h-[2px] bg-black rounded-full transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-[2px] bg-black rounded-full transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>

        </div>
      </header>

      {/* MENU MOBILE PLEIN ÉCRAN FLUIDE & PRATIQUE */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden flex flex-col justify-between pt-28 pb-12 px-8 transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-8"
        }`}
      >
        {/* LISTE DES LIENS MOBILE */}
        <div className="flex flex-col gap-6 items-start">
          <Link
            to="/"
            onClick={closeMenu}
            className={`w-full text-2xl font-serif font-black tracking-widest transition-colors flex items-center justify-between border-b border-gray-100 pb-4 ${
              isActive('/') ? 'text-black' : 'text-gray-400'
            }`}
          >
            <span>ACCUEIL</span>
            <span className="text-sm font-sans font-bold text-gray-300">01</span>
          </Link>

          <Link
            to="/prestations"
            onClick={closeMenu}
            className={`w-full text-2xl font-serif font-black tracking-widest transition-colors flex items-center justify-between border-b border-gray-100 pb-4 ${
              isActive('/prestations') ? 'text-black' : 'text-gray-400'
            }`}
          >
            <span>PRESTATIONS</span>
            <span className="text-sm font-sans font-bold text-gray-300">02</span>
          </Link>

          <Link
            to="/mes-rendez-vous"
            onClick={closeMenu}
            className={`w-full text-2xl font-serif font-black tracking-widest transition-colors flex items-center justify-between border-b border-gray-100 pb-4 ${
              isActive('/mes-rendez-vous') ? 'text-black' : 'text-gray-400'
            }`}
          >
            <span>MES RENDEZ-VOUS</span>
            <span className="text-sm font-sans font-bold text-gray-300">03</span>
          </Link>

          <Link
            to="/admin"
            onClick={closeMenu}
            className={`w-full text-2xl font-serif font-black tracking-widest transition-colors flex items-center justify-between border-b border-gray-100 pb-4 ${
              isActive('/admin') ? 'text-black' : 'text-gray-400'
            }`}
          >
            <span>ADMIN</span>
            <span className="text-sm font-sans font-bold text-gray-300">04</span>
          </Link>
        </div>

        {/* SECTION BAS DU MENU MOBILE WITH BIG CTA BUTTON */}
        <div className="w-full pt-6 flex flex-col gap-4">
          <Link
            to="/reservation"
            onClick={closeMenu}
            className="btn-reserve w-full bg-[#070709] text-white text-center text-xs font-black uppercase tracking-[0.25em] py-5 rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            Réserver un rendez-vous
          </Link>

          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
            VDO Barber • Haute Coiffure
          </p>
        </div>
      </div>

      {/* COMPENSATEUR DE HAUTEUR POUR NE PAS MASQUER LE HAUT DE LA PAGE */}
      <div className="h-24 md:h-28" />
    </>
  );
}

export default Navbar;