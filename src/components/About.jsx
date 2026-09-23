import "./About.css";
import aboutImage from "../assets/djvipul-about.jpeg";

function About() {
  return (
    <section className="about">

      <div className="about-image">
        <img src={aboutImage} alt="DJ Vipul performing" />
      </div>

      <div className="about-content">

        <p className="section-label">ABOUT</p>

        <h2>DJ VIPUL</h2>

        <p>
          With over 3,500 gigs, he has built extensive experience
          performing at private events across India and Dubai.
        </p>

        <p>
          His open-format approach allows him to adapt every set to
          the crowd and occasion, bringing together Bollywood, Indian
          beats and international chart-toppers.
        </p>

        <div className="about-stats">

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

      </div>

    </section>
  );
}

export default About;