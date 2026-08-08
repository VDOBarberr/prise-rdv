import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../services/supabase"

function Navbar() {

  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {

    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data.session)
      })

    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  async function logout() {

    await supabase.auth.signOut()

    navigate("/login")
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav
      className="
        w-full
        bg-white
        px-5
        py-4
        flex
        items-center
        justify-between
        relative
      "
    >

      {/* LOGO */}

      <Link
        to="/"
        onClick={closeMenu}
        className="
          text-black
          whitespace-nowrap
          transition
          duration-300
          hover:opacity-70
          flex
          flex-col
          items-start
        "
      >

        <span
          className="
            text-3xl
            md:text-4xl
            font-serif
            font-semibold
            tracking-[0.35em]
          "
        >
          VDO
        </span>

        <span
          className="
            text-xs
            md:text-sm
            uppercase
            tracking-[0.7em]
            text-gray-600
            ml-1
          "
        >
          Barber
        </span>

      </Link>


      {/* MENU MOBILE */}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          md:hidden
          flex
          flex-col
          gap-1.5
          z-50
        "
      >

        <span
          className={`
            w-7
            h-0.5
            bg-black
            transition-all
            duration-300
            ${menuOpen ? "rotate-45 translate-y-2" : ""}
          `}
        />

        <span
          className={`
            w-7
            h-0.5
            bg-black
            transition-all
            duration-300
            ${menuOpen ? "opacity-0" : ""}
          `}
        />

        <span
          className={`
            w-7
            h-0.5
            bg-black
            transition-all
            duration-300
            ${menuOpen ? "-rotate-45 -translate-y-2" : ""}
          `}
        />

      </button>


      {/* MENU */}

      <div
        className={`
          md:flex

          ${
            menuOpen
              ? "flex opacity-100 translate-y-0"
              : "hidden md:flex"
          }

          flex-col
          md:flex-row

          items-center
          justify-center

          gap-6
          md:gap-8

          absolute
          md:static

          top-full
          left-0

          w-full
          md:w-auto

          bg-white
          md:bg-transparent

          py-8
          md:py-0

          shadow-md
          md:shadow-none

          transition-all
          duration-300

          z-40
        `}
      >

        {/* ACCUEIL */}

        <Link
          to="/"
          onClick={closeMenu}
          className="
            text-sm
            uppercase
            tracking-[0.25em]
            text-gray-600
            hover:text-black
            transition
          "
        >
          Accueil
        </Link>


        {/* PRESTATIONS */}

        <Link
          to="/prestations"
          onClick={closeMenu}
          className="
            text-sm
            uppercase
            tracking-[0.25em]
            text-gray-600
            hover:text-black
            transition
          "
        >
          Prestations
        </Link>


        {/* MES RENDEZ-VOUS */}

        <Link
          to="/mes-rendez-vous"
          onClick={closeMenu}
          className="
            text-sm
            uppercase
            tracking-[0.25em]
            text-gray-600
            hover:text-black
            transition
          "
        >
          Mes rendez-vous
        </Link>


        {/* RESERVER */}

        <Link
          to="/reservation"
          onClick={closeMenu}
          className="
            px-8
            py-3
            rounded-full
            bg-black
            text-white
            text-sm
            uppercase
            tracking-[0.2em]
            hover:bg-gray-800
            transition
            shadow-md
          "
        >
          Réserver
        </Link>


        {/* ADMIN */}

        {!session && (

          <Link
            to="/login"
            onClick={closeMenu}
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-gray-600
              hover:text-black
              transition
            "
          >
            Admin
          </Link>

        )}


        {/* PLANNING */}

        {session && (

          <Link
            to="/admin"
            onClick={closeMenu}
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-gray-600
              hover:text-black
              transition
            "
          >
            Planning
          </Link>

        )}


        {/* DECONNEXION */}

        {session && (

          <button
            onClick={logout}
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-gray-600
              hover:text-black
              transition
            "
          >
            Déconnexion
          </button>

        )}

      </div>

    </nav>
  )
}

export default Navbar