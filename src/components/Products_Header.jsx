import {
  faCoffee,
  faPen,
  faPersonFalling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import logo from "../assets/my_logo.png";

function Products_Header() {
  const navigate = useNavigate();

  return (
    <div className="products-header">
      <div className="brand-logo">
        <img src={logo} width={20} alt="" />
      </div>
      <div className="products-categories">
        <button className="active" onClick={() => navigate("/main")}>
          <FontAwesomeIcon icon={faCoffee} />
        </button>
        <button onClick={() => navigate("/main/edit_me")}>
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
    </div>
  );
}

export default Products_Header;
