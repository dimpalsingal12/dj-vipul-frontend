import "./Services.css";

function Services() {
  return (
    <section className="services">

      <p className="section-label">SERVICES</p>

      <h2>MUSIC FOR THE MOMENT</h2>

      <p className="services-intro">
        From celebrations to special occasions, the right music sets
        the mood, builds the energy and brings people together.
      </p>

      <div className="event-services">

        <div>
          <h3>💍 WEDDINGS</h3>
          <p>Sangeet • Reception • Celebrations</p>
        </div>

        <div>
          <h3>🎉 PRIVATE EVENTS</h3>
          <p>Birthdays • Anniversaries • Parties</p>
        </div>

        <div>
          <h3>💼 CORPORATE</h3>
          <p>Events • Launches • Celebrations</p>
        </div>

        <div>
          <h3>🎧 COLLEGE & CLUB EVENTS</h3>
          <p>College Fests • Club Nights • DJ Events</p>
        </div>

      </div>

      <div className="music-section">

        <p className="section-label">MUSIC</p>

        <h2>SOUND THAT FITS THE ROOM</h2>

        <div className="music-list">
          <span>Bollywood & Indian Beats</span>
          <span>Dance Music</span>
          <span>Hip Hop / R&B</span>
          <span>Pop / Mainstream</span>
          <span>Classics</span>
        </div>

      </div>

    </section>
  );
}

export default Services;