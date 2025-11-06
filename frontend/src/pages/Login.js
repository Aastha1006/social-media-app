import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      alert("Login successful!");
      navigate("/feed");
    } catch (err) {
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="night-container">
      <div className="moon"></div>

      {/* Shooting stars */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="shooting-star"></div>
      ))}

      {/* Clouds */}
      <div className="cloud c1"></div>
      <div className="cloud c2"></div>

      {/* Mountains */}
      <div className="mountain m1"></div>
      <div className="mountain m2"></div>
      <div className="mountain m3"></div>

      {/* Login box */}
      <div className="login-card">
        <h2>Welcome Back </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
