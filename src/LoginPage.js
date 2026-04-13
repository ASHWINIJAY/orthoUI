// LoginPage.js
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import API_BASE_URL from "./config";

const backgroundStyle = {
  backgroundImage: "url('/ortho-xact/ortho-bg.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Ortho-Xact"; // or "Dashboard", etc.
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // show loader
  
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
  
      if (response.status === 200) {
        const result = await response.json(); // ✅ parse response JSON
        const roles = result.user.roles;
        const jwt_token = result.token;
  
        localStorage.setItem("username", username);
        localStorage.setItem("roles", roles);
        localStorage.setItem("jwt_token", jwt_token);
        if(roles === 'rep')
        {
          navigate("/form");
        }
        else if(roles === 'repclerk')
        {
          navigate("/RepClerk");
        }
        else
      {
        navigate("/ReviewDN");
      }
        
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      setIsLoading(false); // hide loader
    }
  };

  return (
    <div style={backgroundStyle}>
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/ortho-xact/logos.png" alt="Logo" className="logo" />

        <div className="input-group">
  <label>Username</label>
  <input
    type="text"
    placeholder="Enter your username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
  />
</div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
  {isLoading ? "Logging in..." : "Login"}
</button>
      </form>
    </div></div>
  );
}

export default LoginPage;
