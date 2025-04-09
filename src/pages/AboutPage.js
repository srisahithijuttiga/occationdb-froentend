import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutPage.css";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <h1>🎉 Welcome to Occasions Gallery</h1>
      <p>
        At <strong>Occasions Gallery</strong>, we celebrate life's special moments with joy and warmth. 
        From heartfelt messages to surprise greetings, every interaction is designed to make your loved ones smile.
      </p>
      
      <p>
        Whether it’s a birthday, an anniversary, or just a note to say you care, we help you create memories that last a lifetime.
        Every surprise is thoughtfully crafted to bring happiness and connection.
      </p>

      <p>
        Thank you for being part of our celebration. Let's make every moment unforgettable. 💖
      </p>

      <button onClick={() => navigate("/")}>🏠 Go to Home</button>
    </div>
  );
};

export default AboutPage;
