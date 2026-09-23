import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save admin information for the current session
        localStorage.setItem("admin", JSON.stringify(data.admin));

        // Save JWT token for protected admin API requests
        localStorage.setItem("adminToken", data.token);

        navigate("/admin");
      } else {
        setMessage(data.message || "Invalid admin username or password");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">

        <p>ADMIN PANEL</p>

        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>

          <div>
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            LOGIN
          </button>

        </form>

        {message && (
          <p className="admin-login-message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default AdminLogin;