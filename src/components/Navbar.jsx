
import djLogo from "../assets/Djvlogo.jpg";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem("customer");
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Update customer whenever the route changes
  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer");

    setCustomer(savedCustomer ? JSON.parse(savedCustomer) : null);
  }, [location.pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    setCustomer(null);
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img src={djLogo} alt="DJ Vipul Logo" />
        </Link>
      </div>

      <div className="mobile-icons">

        {customer ? (
          <Link
            to="/account"
            className="account-icon"
            onClick={closeMenu}
          >
            <FaUser />
          </Link>
        ) : (
          <Link
            to="/login"
            className="account-icon"
            onClick={closeMenu}
          >
            <FaUser />
          </Link>
        )}

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ⋮
        </button>

      </div>

      <ul className={`nav-links ${menuOpen ? "show" : ""}`}>

        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>

        <li>
          <Link to="/about" onClick={closeMenu}>About</Link>
        </li>

        <li>
          <Link to="/services" onClick={closeMenu}>Services</Link>
        </li>

        <li>
          <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
        </li>

        <li>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </li>

        {customer ? (
          <>
            <li className="desktop-login">
              <Link to="/account" onClick={closeMenu}>
                <FaUser /> Hi, {customer.name}
              </Link>
            </li>

            <li className="mobile-login">
              <Link to="/account" onClick={closeMenu}>
                Hi, {customer.name}
              </Link>
            </li>

            <li className="mobile-register">
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="desktop-login">
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </li>

            <li className="mobile-login">
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </li>

            <li className="mobile-register">
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            </li>
          </>
        )}

        <li className="mobile-book">
          <Link to="/booking" onClick={closeMenu}>
            Book Now
          </Link>
        </li>

      </ul>

      <Link to="/booking" className="book-btn">
        BOOK NOW
      </Link>

    </nav>
  );
}

export default Navbar;