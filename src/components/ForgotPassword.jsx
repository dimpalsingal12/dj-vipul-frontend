import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-box">

        <h1>Forgot Password?</h1>

        <p>
          Enter your registered email address and we will
          send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="forgot-password-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="forgot-password-button">
            Send Reset Link
          </button>

        </form>

        {message && (
          <p className="forgot-password-success">
            {message}
          </p>
        )}

        {error && (
          <p className="forgot-password-error">
            {error}
          </p>
        )}

        <p className="back-login-text">
          Remember your password?{" "}
          <Link to="/login">Back to Login</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;