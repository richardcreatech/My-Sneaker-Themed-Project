import { Routes, Route } from "react-router"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Auth from "./pages/app/auth/Auth"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} >
      <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        
      </Route>
        <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App