import { Route, Routes } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App