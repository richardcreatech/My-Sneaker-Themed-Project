import { Outlet } from "react-router"
import Home_Header from "../components/Home_Header"
import GestureController from "../components/GestureController"

function Landing() {
  return (
    <main id="lnd_pg">
      <GestureController />
            <div className="bg-pattern" />

          <Home_Header />
          <Outlet />
    </main>
  )
}

export default Landing