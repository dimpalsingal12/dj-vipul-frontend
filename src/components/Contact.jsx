import {
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaGoogleDrive,
} from "react-icons/fa";

import "./Contact.css";
import instagramQR from "../assets/instagram-qr.jpeg";

function Contact() {
  return (
    <section className="contact">

      <div className="contact-left">

        <div className="contact-intro">
          <span className="intro-label">GET IN TOUCH</span>

          <h2>
            LET'S
            <br />
            <strong>CONNECT!</strong>
          </h2>

          <p>
            Have an event in mind? Let's make it unforgettable.
            Reach out to us through any of the platforms below
            or scan the QR code for quick access.
          </p>
        </div>

        <div className="contact-main">

          <div className="contact-details">

            <p>
              <FaInstagram />

              <span className="contact-info">
                <small>INSTAGRAM</small>
                djvipulofficialmumbai
              </span>

              <b className="contact-arrow">↗</b>
            </p>

            <p>
              <FaPhoneAlt />

              <span className="contact-info">
                <small>PHONE</small>

                <span className="phone-numbers">
                  +91 8655005545
                  <i>|</i>
                  +91 9322228902
                </span>
              </span>

              <b className="contact-arrow">↗</b>
            </p>

            <p>
              <FaEnvelope />

              <span className="contact-info">
                <small>EMAIL</small>
                djvipulofficialmumbai@gmail.com
              </span>

              <b className="contact-arrow">↗</b>
            </p>

            <p>
              <FaGoogleDrive />

              <span className="contact-info">
                <small>GOOGLE DRIVE</small>
                Google Drive Link
              </span>

              <b className="contact-arrow">↗</b>
            </p>

          </div>

          <div className="qr-box">
            <img
              src={instagramQR}
              alt="Instagram QR Code"
            />

            <span>SCAN TO CONNECT</span>

            <p>
              Follow us on Instagram
              <br />
              for latest updates, events & more.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;