import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faPen,
  faPersonFalling,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router";
import Products_Header from "../../../components/Products_Header";

function AppLayout() {
  return (
    <section className="products-page">
      {/* HEADER */}
      <Products_Header />

      <Outlet />
    </section>
  );
}

export default AppLayout;
