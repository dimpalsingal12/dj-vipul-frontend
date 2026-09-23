import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ServicesPage.css";

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data.filter((service) => service.active));
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  return (
    <section className="services-page">

      {/* =========================
          HERO
      ========================= */}

      <div className="services-hero">

        <div className="services-hero-content">

          <span>
            DJ VIPUL • PROFESSIONAL SOUND & LIGHTS
          </span>

          <h1>
            SOUND THAT
            <br />
            <strong>SETS THE MOOD.</strong>
          </h1>

          <p>
            From elegant celebrations to high-energy nights,
            we create the sound, atmosphere and energy your event deserves.
          </p>

          <Link
            to="/booking"
            className="services-hero-btn"
          >
            BOOK YOUR EVENT
          </Link>

        </div>

      </div>


      {/* =========================
          SERVICES
      ========================= */}

      <div className="services-section">

        <div className="services-heading">

          <span>SERVICES</span>

          <h2>
            BUILT FOR
            <br />
            <em>YOUR MOMENT.</em>
          </h2>

          <p>
            Every occasion has a different rhythm. Choose the experience
            that fits your event and let the music take care of the rest.
          </p>

        </div>


        <div className="services-grid">

          {services.length === 0 ? (

            <p className="no-services">
              No services available at the moment.
            </p>

          ) : (

            services.map((service) => (

              <div
                className="service-card"
                key={service._id}
              >

                <div className="service-card-glow"></div>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

                <span className="service-arrow">
                  →
                </span>

              </div>

            ))

          )}

        </div>

      </div>


      {/* =========================
          EXPERIENCE
      ========================= */}

      <div className="experience-section">

        <div className="experience-heading">

          <span>
            THE EXPERIENCE
          </span>

          <h2>
            WHAT MAKES
            <br />
            <em>THE DIFFERENCE.</em>
          </h2>

        </div>


        <div className="experience-cards">

          <div className="experience-card">

            <div className="card-icon">
              ♪
            </div>

            <h3>
              THE DJ
            </h3>

            <p>
              Read the crowd, understand the energy and adapt the music
              to keep every moment moving.
            </p>

          </div>


          <div className="experience-card">

            <div className="card-icon">
              ◉
            </div>

            <h3>
              THE SOUND
            </h3>

            <p>
              Professional sound and a carefully selected musical
              experience designed around the event.
            </p>

          </div>


          <div className="experience-card">

            <div className="card-icon">
              ✦
            </div>

            <h3>
              THE ENERGY
            </h3>

            <p>
              From intimate celebrations to high-energy nights,
              every performance is built to leave an impression.
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          MUSIC
      ========================= */}

      <div className="genres-section">

        <div className="genres-heading">

          <span>
            MUSIC
          </span>

          <h2>
            ONE NIGHT.
            <br />
            <em>EVERY VIBE.</em>
          </h2>

          <p>
            An open-format approach that moves effortlessly between
            sounds, styles and generations.
          </p>

        </div>


        <div className="genres">

          <div className="genre-card">

            <span>
              CLASSICS
            </span>

            <p>
              80s • 90s • 00s • Disco • Funk
            </p>

          </div>


          <div className="genre-card">

            <span>
              DANCE MUSIC
            </span>

            <p>
              Afro House • Dance Pop • Deep House • Tech House • Techno • Trance
            </p>

          </div>


          <div className="genre-card">

            <span>
              HIP HOP / R&B
            </span>

            <p>
              Old School • Soul • Neo-Soul • Trap Soul
            </p>

          </div>


          <div className="genre-card">

            <span>
              POP / MAINSTREAM
            </span>

            <p>
              Latin Pop • Moombahton • Mambo • Reggaeton
            </p>

          </div>


          <div className="genre-card genre-wide">

            <span>
              BOLLYWOOD & INDIAN BEATS
            </span>

            <p>
              Bollywood Dance • Retro Hindi • Bhangra • Indie Pop • Desi House
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          CTA
      ========================= */}

      <div className="services-cta">

        <div className="cta-glow"></div>

        <span>
          LET'S CREATE THE MOMENT
        </span>

        <h2>
          YOUR EVENT.
          <br />
          <em>YOUR ENERGY.</em>
        </h2>

        <p>
          Tell us what you're planning and let's create the right
          sound, atmosphere and experience for your crowd.
        </p>

        <Link
          to="/booking"
          className="services-cta-btn"
        >
          START PLANNING →
        </Link>

      </div>

    </section>
  );
}

export default ServicesPage;