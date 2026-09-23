import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "customer",
          JSON.stringify(data.customer)
        );

        localStorage.setItem("customerToken", data.token);

        navigate("/", {
          state: {
            loginSuccess: true,
            customerName: data.customer.name,
          },
        });
      } else {
        setErrorMessage(
          "Incorrect email or password. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "Unable to connect to the server. Please try again later."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>Welcome Back</h1>
        <p>Sign in to manage your bookings</p>

        <form onSubmit={handleLogin}>

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        {errorMessage && (
          <p className="login-error">
            {errorMessage}
          </p>
        )}

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;