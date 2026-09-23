import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const location = useLocation();

  const isContactPage = location.pathname === "/contact";
  const isBookingPage = location.pathname === "/booking";

  return (
    <footer className="footer">

      <div className="footer-content">

        <h2>MAKE YOUR EVENT</h2>
        <h3>UNFORGETTABLE.</h3>

        <p>Music. Energy. The right atmosphere.</p>

        <div className="footer-buttons">

          {!isBookingPage && (
            <Link to="/booking" className="book-btn">
              BOOK NOW
            </Link>
          )}

          {!isContactPage && (
            <Link to="/contact" className="contact-btn">
              CONTACT US
            </Link>
          )}

        </div>

        

        <div className="footer-brand">
          DJ VIPUL <span>•</span> PROFESSIONAL SOUND & LIGHTS
        </div>

        <div className="footer-bottom">
          © 2026 DJ VIPUL. ALL RIGHTS RESERVED.
        </div>

      </div>

    </footer>
  );
}

export default Footer;