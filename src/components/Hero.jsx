import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

import defaultHeroImage from "../assets/djvipul-hero.jpeg";

function Hero() {
  const [heroImage, setHeroImage] = useState(defaultHeroImage);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hero`
        );

        const data = await response.json();

        if (response.ok && data?.imageUrl) {
          setHeroImage(data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.55),
            rgba(0,0,0,0.55)
          ),
          url("${heroImage}")
        `,
      }}
    >

      <div className="hero-content">

        <h1>DJ VIPUL</h1>

        <h2>Professional Sound & Lights</h2>

        <p className="hero-description">
          Turning Moments Into Memories
        </p>

        <p className="event-types">
          DJ Since 2007 • 3.5K+ Gigs • Mumbai
        </p>

        <div className="hero-buttons">

          <Link to="/booking" className="book-btn">
            BOOK NOW
          </Link>

          <Link to="/services" className="explore-btn">
            EXPLORE SERVICES
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;