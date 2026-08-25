import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/public/LandingPage"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import RideSearch from "./pages/Rider/RideSearch"
import RideCreate from "./pages/Rider/RideCreate"
import DriverDashboard from "./pages/Driver/DriverDashboard"
import DriverActiveRide from "./pages/Driver/DriverActiveRide"
import DriverProfile from "./pages/Driver/DriverProfile"
import RiderProfile from "./pages/Rider/RiderProfile"

import { DriverWebSocketProvider } from "./contexts/DriverWebSocketContext"
import PublicRoute from "./components/shared/PublicRoute"
import ProtectedRoute from "./components/shared/ProtectedRoute"

function App() {
  return (
    <div>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole={"RIDER"} />}>
          <Route path="/ride/search" element={<RideSearch />} />
          <Route path="/ride/create" element={<RideCreate />} />
          <Route path="/ride/profile" element={<RiderProfile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole={"DRIVER"} />}>
          <Route path="/driver/*" element={
            <DriverWebSocketProvider>
              <Routes>
                <Route path="" element={<DriverDashboard />} />
                <Route path="active" element={<DriverActiveRide />} />
                <Route path="profile" element={<DriverProfile />} />
              </Routes>
            </DriverWebSocketProvider>
          } />
        </Route>
      </Routes>
    </div>
  )
}

export default App