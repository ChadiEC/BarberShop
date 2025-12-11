import { useState } from "react";
import api from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      // On sauvegarde user + token dans localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect vers home
      navigate("/");
    } catch (err) {
      toast.error("Wrong credentials");
      // futur: afficher un message UI propre
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-row">
          <button type="submit" className="login-btn">
            Login
          </button>

          <button
            type="button"
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        <Link to="/forgot-password" className="forgot-link">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
