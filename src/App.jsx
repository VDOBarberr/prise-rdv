import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Reservation from "./pages/Reservation"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Prestations from "./pages/Prestations"

import ProtectedRoute from "./components/ProtectedRoute"



function App() {

  return (

    <BrowserRouter>


      <Navbar />


      <Routes>


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/reservation"
          element={<Reservation />}
        />


        <Route
          path="/prestations"
          element={<Prestations />}
        />        <Route
          path="/login"
          element={<Login />}
        />



        <Route

          path="/admin"

          element={

            <ProtectedRoute>

              <Admin />

            </ProtectedRoute>

          }

        />


      </Routes>


    </BrowserRouter>

  )

}


export default App