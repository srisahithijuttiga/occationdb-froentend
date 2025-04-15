import React, { useEffect } from "react";
import "../styles/LoveFireworks.css";

const LoveFireworks = () => {
  useEffect(() => {
    const container = document.createElement("div");
    container.className = "love-fireworks-container";
    document.body.appendChild(container);

    const createHeart = () => {
      const heart = document.createElement("div");
      heart.className = "heart";

      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.width = `${12 + Math.random() * 12}px`;
      heart.style.height = `${12 + Math.random() * 12}px`;
      heart.style.animationDuration = `${3 + Math.random() * 2}s`;

      container.appendChild(heart);

      setTimeout(() => heart.remove(), 6000);
    };

    const interval = setInterval(createHeart, 100); // Faster rate

    return () => {
      clearInterval(interval);
      container.remove();
    };
  }, []);

  return null;
};

export default LoveFireworks;
