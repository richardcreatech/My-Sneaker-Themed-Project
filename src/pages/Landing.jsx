import { Outlet } from "react-router"
import Home_Header from "../components/Home_Header"

function Landing() {
  return (
    <main id="lnd_pg">
            <div className="bg-pattern" />

          <Home_Header />
          <Outlet />
    </main>
  )
}

export default Landing