import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <h1 className="greeting">🎉 Welcome to Your Special Celebration! 🎂</h1>
      <p className="celebration-text">Enjoy this journey filled with love and surprises! ❤️</p>
      <button className="btn primary" onClick={() => navigate("/cake")}>Let's Go! ✨</button>
    </div>
  );
};

export default LandingPage;