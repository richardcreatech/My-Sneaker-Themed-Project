import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/my_logo.png";
import {
  faCoffee,
  faPen,
  faPersonFalling,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <section className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <div className="brand-logo">
          <img src={logo} width={20} alt="" />
        </div>
        <div className="products-categories">
          <button className="active">
            <FontAwesomeIcon icon={faCoffee} />
          </button>
          <button>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button>
            <FontAwesomeIcon icon={faPersonFalling} />
          </button>
        </div>
      </div>

      <Outlet />
    
    </section>
  );
}

export default AppLayout;