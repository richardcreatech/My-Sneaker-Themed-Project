import { faCoffee, faPen, faPersonFalling } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from "../assets/my_logo.png";


function Products_Header() {
  return (
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
  )
}

export default Products_Header
