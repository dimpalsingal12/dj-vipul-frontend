import "./WelcomePopup.css";

function WelcomePopup({ customerName, onClose }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-popup">

        <button
          className="welcome-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="welcome-icon">✓</div>

        <p className="welcome-small">
          LOGIN SUCCESSFUL
        </p>

        <h2>
          Welcome, {customerName}! 👋
        </h2>

        <p className="welcome-text">
          You have successfully logged in to
          <strong> DJ Vipul Professional Sound & Lights.</strong>
        </p>

        <button
          className="welcome-button"
          onClick={onClose}
        >
          CONTINUE
        </button>

      </div>
    </div>
  );
}

export default WelcomePopup;