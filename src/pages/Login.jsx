import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#070709] flex items-center justify-center px-6 relative overflow-hidden font-sans selection:bg-black selection:text-white">
      
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

        /* Carte Login Luxe */
        .card-login {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-login:hover {
          border-color: rgba(0, 0, 0, 0.15);
          box-shadow: 0 35px 70px -10px rgba(0, 0, 0, 0.12);
        }

        /* Bouton dynamique */
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
      `}</style>

      {/* ARRIÈRE-PLAN ANIMÉ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/[0.03] rounded-full blur-[140px] anim-rotate" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
      </div>

      {/* CONTENEUR FORMULAIRE */}
      <div className="relative z-10 w-full max-w-md card-login rounded-[2.5rem] p-8 md:p-12">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-[9px] tracking-[0.35em] uppercase text-gray-600 font-extrabold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            Espace Privé
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#070709]">
            VDO <span className="italic font-light text-gray-500">Barber</span>
          </h1>

          <p className="text-gray-500 text-xs uppercase tracking-[0.25em] font-bold mt-2">
            Administration
          </p>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* EMAIL */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="admin@vdobarber.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black placeholder-gray-400 text-sm outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white focus:scale-[1.01] shadow-sm"
            />
          </div>

          {/* MOT DE PASSE */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-black/10 p-4 rounded-2xl text-black placeholder-gray-400 text-sm outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black focus:bg-white focus:scale-[1.01] shadow-sm"
            />
          </div>

          {/* ERREUR */}
          {error && (
            <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          {/* BOUTON SE CONNECTER */}
          <button
            type="submit"
            disabled={loading}
            className="btn-badass w-full bg-[#070709] text-white py-4 rounded-2xl uppercase tracking-[0.25em] text-xs font-black shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>

        </form>

        {/* FOOTER DISCRET */}
        <div className="mt-10 pt-6 border-t border-black/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">
            Accès sécurisé • VDO Studio
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;