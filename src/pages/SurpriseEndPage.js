import React, { useEffect ,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SurpriseEndPage.css";

const SurpriseEndPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const heartContainerRef = useRef(null);

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

  return (
    <div className="end-page">
      <div className="hearts-container" ref={heartContainerRef}></div>
      <div className="end-message-box">
        <h1>🎁 That’s a wrap!</h1>
        <p className="thank-you">Hope you like this beautiful surprise.</p>
        <p className="closing">Wishing you endless smiles, love, and joy 💖</p>
        <button onClick={() => navigate(`/gallery/${personId}`)}>🔁 Watch Again</button>
      </div>
    </div>
  );
};
// background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
// color: #ffffff;
// background: radial-gradient(circle at center, #1f1c2c, #928DAB);
// color: #ffffff;


export default SurpriseEndPage;
