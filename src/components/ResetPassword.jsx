import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-box">

        <h1>Reset Password</h1>

        <p>Create a new password for your account.</p>

        <form onSubmit={handleSubmit}>

          <div className="reset-password-field">
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="reset-password-field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-password-button">
            Reset Password
          </button>

        </form>

        {message && (
          <p className="reset-password-success">
            {message}
          </p>
        )}

        {error && (
          <p className="reset-password-error">
            {error}
          </p>
        )}

        <p className="back-login-text">
          <Link to="/login">Back to Login</Link>
        </p>

      </div>
    </div>
  );
}

export default ResetPassword;