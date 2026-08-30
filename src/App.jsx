import { Routes, Route } from "react-router"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Auth from "./pages/app/auth/Auth"
import Products from "./pages/app/main/Products"
function App() {
  return (
    <Routes>
      {/* Route to the landing page */}
      <Route path="/" element={<Landing />} >
      <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        
      </Route>

      {/* Route to the Auth page */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Route to the Main Application page */}
        <Route path="/main" element={<Products />} />
    </Routes>
  )
}

export default App