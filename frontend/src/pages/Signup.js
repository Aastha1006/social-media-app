import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        password,
      });

      setTransitioning(true);

      setTimeout(() => {
        alert("Signup successful! Now entering night mode 🌙");
        navigate("/");
      }, 2500);
    } catch (err) {
      alert("Signup failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className={`signup-container ${transitioning ? "night" : ""}`}>
      {/* ☀ Sun */}
      <div className="sun"></div>

      {/* ☁ Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>

      {/* 🌳 Trees */}
      <div className="trees">
        <div className="trees"></div>
        <div className="trees"></div>
        <div className="trees"></div>
        <div className="trees"></div>
        <div className="trees"></div>
      </div>

      <form className="signup-box" onSubmit={handleSignup}>
        <h2>{transitioning ? "Good Night 🌙" : "Create Account "}</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={transitioning}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={transitioning}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={transitioning}
        />
        <button type="submit" disabled={transitioning}>
          {transitioning ? "Transitioning..." : "Sign Up"}
        </button>
        {!transitioning && (
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default Signup;
