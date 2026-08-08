import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Reservation from "./pages/Reservation"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Prestations from "./pages/Prestations"
import Booking from "./pages/Booking"
import ProtectedRoute from "./components/ProtectedRoute"
import MesRendezVous from "./pages/MesRendezVous"

function App(){

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
element={<Booking />}
/>


<Route
path="/prestations"
element={<Prestations />}
/>


<Route
path="/login"
element={<Login />}
/>

<Route
  path="/mes-rendez-vous"
  element={<MesRendezVous />}
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