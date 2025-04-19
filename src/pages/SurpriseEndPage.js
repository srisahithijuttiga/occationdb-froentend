import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FinalWrapPage from "./FinalWrapPage";
import "../styles/SurpriseEndPage.css";

const SurpriseEndPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const heartContainerRef = useRef(null);
  const [frames, setFrames] = useState([]);

  // ❤️ Floating hearts
  useEffect(() => {
    const container = heartContainerRef.current;
    if (!container) return;

    let heartCount = 0;
    const maxHearts = 15;

    const createHeart = () => {
      if (heartCount >= maxHearts) return;

      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${4 + Math.random() * 3}s`;
      heart.style.opacity = `${0.5 + Math.random() * 0.4}`;
      container.appendChild(heart);
      heartCount++;

      setTimeout(() => {
        heart.remove();
        heartCount--;
      }, 7000);
    };

    const interval = setInterval(() => {
      if (container.childNodes.length < maxHearts) createHeart();
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // 📸 Fetch captured frames from sessionStorage
  useEffect(() => {
    const savedFrames = JSON.parse(sessionStorage.getItem("reactionFrames") || "[]");
    setFrames(savedFrames);
  }, []);

  const generateCaption = (pageName) => {
    switch (pageName) {
      case "landing":
        return "✨ A spark of joy right from the start!";
      case "cake":
        return "🎂 That cake moment hit differently!";
      case "greeting":
        return "💌 Heartfelt emotion captured here.";
      case "gallery":
        return "🖼️ Awe and admiration in one shot.";
      case "video":
        return "🎥 Bright smile spotted 😊";
      default:
        return "💖 A wonderful reaction!";
    }
  };

  return (
    <div className="end-page">
      <div className="hearts-container" ref={heartContainerRef}></div>

      <div className="end-message-box">
        <h1>🎁 That’s a wrap!</h1>
        <p className="thank-you">Hope you like this beautiful surprise.</p>
        <p className="closing">Wishing you endless smiles, love, and joy 💖</p>
        <button onClick={() => navigate(`/gallery/${personId}`)}>🔁 Watch Again</button>
      </div>

      {/* 📸 AI Reaction Highlights */}
      <div className="reaction-moments">
  <h2>💡 Your Best Reactions</h2>
  <div className="reaction-gallery">
    {frames.map((frame, index) => (
      <div className="reaction-item" key={index}>
        <img src={frame.image} alt={`Reaction ${index + 1}`} />
        <p className="summary">{generateCaption(frame.page)}</p>
      </div>
    ))}
  </div>
</div>


      {/* ✍️ Review Section */}
      <FinalWrapPage username={personId} />
    </div>
  );
};

export default SurpriseEndPage;
