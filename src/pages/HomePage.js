import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/HomePage.css";

const HomePage = () => {
  const [personId, setPersonId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showContact, setShowContact] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("person"));
    if (data?.id) setPersonId(data.id);
  }, []);
  useEffect(() => {
    axios.get("/api/reviews")
      .then((res) => {
        const reviewList = res.data.map(r => ({
          username: r.username?.split("-")[0],
          message: r.message
        }));
        setReviews(reviewList);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  }, []);
  
  const handleStart = () => {
    if (personId) {
      navigate(`/surprise/${personId}`);
    } else {
      alert("Please login through your surprise link!");
    }
  };

  const occasionCards = [
    { title: "Birthday", emoji: "🎂", img: "/assets/bday.png" },
    { title: "Anniversary", emoji: "💍", img: "/assets/anvrsy.png" },
    { title: "Love Note", emoji: "❤️", img: "/assets/lovenote.png" },
    { title: "Job Congrats", emoji: "🎉", img: "/assets/jobcongr.png" },
    { title: "Graduation", emoji: "🎓", img: "/assets/grad.png" },
    { title: "Cheer Up", emoji: "🌈", img: "/assets/cheerup.png" },
  ];

  return (
    <div className="home-page" >
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎉 Celebrate Moments</h1>
          <p className="hero-sub">Make someone smile with a personalized surprise</p>
          <button onClick={() => setShowContact(true)}>Request a Surprise</button>
        </div>
      </div>
      {showContact && (
  <div className="contact-popup">
    <h3>🎁 Want to Surprise Someone?</h3>
    <p>Please contact us at:</p>
    <ul>
      <li>📧 Email: theoccation1998@gmail.com</li>
      <li>📱 WhatsApp: +91-9876543210</li>
      <li>💬 Instagram: @occasions.gallery</li>
    </ul>
    <button onClick={() => setShowContact(false)}>Close</button>
  </div>
)}

      {/* Choose Your Occasion */}
      <div className="occasion-section">
        <h2>🎁 Choose Your Occasion</h2>
        <div className="poster-card-row">
          {occasionCards.map((item, i) => (
            <div
              className="poster-card"
              key={i}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="poster-overlay">
                <span className="poster-emoji">{item.emoji}</span>
                <h3 className="poster-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h2 className="review-section-title">💬 What People Are Saying</h2>
          <div className="review-carousel-container">
            <div className="review-carousel">
              {[...reviews].slice(0, 9).map((r, i) => (
                <div className="review-carousel__item" key={i}>
                  <div className="review-carousel__item-head">💬</div>
                  <div className="review-carousel__item-body">
                    <p className="title">{r.username}</p>
                    <p>{r.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-this-page">
            <h2>✨ Why This Page?</h2>
            <p>
              This platform is all about spreading love, joy, and personalized surprises. 
              Whether it's a birthday, anniversary, or just a sweet message to make someone's day—
              this page brings it all together with custom wishes, voice notes, heartfelt galleries, 
              and surprise videos. It's a virtual hug that reaches the soul. 💖
            </p>
            <button className="about-button" onClick={() => navigate("/about")}> About Us </button>
          </div>

    </div>
  );
};

export default HomePage;
