import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/public/LandingPage"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import RideSearch from "./pages/rider/RideSearch"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ride-search" element={<RideSearch />} />
      </Routes>
    </div>
  )
}

export default App