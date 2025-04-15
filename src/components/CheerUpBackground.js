import React, { useEffect } from "react";
import "../styles/CheerUpBackground.css";

const CheerUpBackground = () => {
  useEffect(() => {
    const createElement = (className, image) => {
      const el = document.createElement("div");
      el.className = `cheerup-element ${className}`;
      el.style.backgroundImage = `url(${image})`;
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `${Math.random() * 100}vh`;
      el.style.animationDuration = `${5 + Math.random() * 5}s`;
      el.style.animationDelay = `${Math.random() * 5}s`;
      document.querySelector(".cheerup-background").appendChild(el);

      setTimeout(() => el.remove(), 10000);
    };

    const interval = setInterval(() => {
      createElement("flower", "/assets/smilee.png");
      createElement("star", "/assets/star.png");
      createElement("star", "/assets/heartimg.png");
    }, 700);

    return () => {
      clearInterval(interval);
      document.querySelectorAll(".cheerup-element").forEach((e) => e.remove());
    };
  }, []);

  return <div className="cheerup-background" />;
};

export default CheerUpBackground;
