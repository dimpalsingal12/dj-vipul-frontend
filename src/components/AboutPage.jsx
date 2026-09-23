import { Link } from "react-router-dom";
import aboutImage from "../assets/djvipul-about.jpeg";
import "./AboutPage.css";

function AboutPage() {
  return (
    <section className="about-page">

      {/* Page Intro */}

      <div className="about-page-header">
        <p className="section-label">ABOUT DJ VIPUL</p>

        <h1>MORE THAN JUST MUSIC.</h1>

        <p>
          Creating the right atmosphere, reading the crowd and making
          every celebration feel unforgettable.
        </p>
      </div>


      {/* Main Story */}

      <div className="about-story">

        <div className="about-page-image">
          <img
            src={aboutImage}
            alt="DJ Vipul performing"
          />
        </div>

        <div className="about-story-content">

          <p className="section-label">THE JOURNEY</p>

          <h2>EXPERIENCE THAT MOVES WITH THE CROWD</h2>

          <p>
            DJ Vipul has been creating memorable experiences since 2007,
            performing at celebrations and events where music is at the
            heart of the occasion.
          </p>

          <p>
            With experience across private celebrations and events in
            India and Dubai, every performance is approached
            with the understanding that no two events are the same.
          </p>

          <p>
            From Bollywood and Indian beats to international chart-toppers,
            the music adapts to the crowd, the venue and the energy of the
            moment.
          </p>

        </div>

      </div>


      {/* Stats */}

      <div className="about-page-stats">

        <div>
          <h3>2007</h3>
          <span>DJ SINCE</span>
        </div>

        <div>
          <h3>3.5K+</h3>
          <span>GIGS</span>
        </div>

        <div>
          <h3>2</h3>
          <span>COUNTRIES</span>
        </div>

      </div>


      {/* Approach */}

      <div className="about-approach">

        <p className="section-label">THE APPROACH</p>

        <h2>EVERY EVENT HAS ITS OWN ENERGY.</h2>

        <div className="approach-grid">

          <div>
            <h3>Read The Crowd</h3>
            <p>
              Understanding the room and knowing when to build the
              energy, change the mood or keep the dance floor moving.
            </p>
          </div>

          <div>
            <h3>Music That Fits</h3>
            <p>
              An open-format approach that allows the music to move
              naturally with the occasion and the people.
            </p>
          </div>

          <div>
            <h3>Made For The Moment</h3>
            <p>
              Every performance is shaped around the event rather
              than following a fixed formula.
            </p>
          </div>

        </div>

      </div>


      {/* CTA */}

      <div className="about-cta">

        <h2>READY TO CREATE THE RIGHT ATMOSPHERE?</h2>

        <Link to="/booking" className="about-cta-btn">
          BOOK YOUR EVENT
        </Link>

      </div>

    </section>
  );
}

export default AboutPage;