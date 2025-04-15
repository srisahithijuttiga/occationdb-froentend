import React, { useEffect } from "react";
import "../styles/AnniversaryBackground.css"; // Make sure this file has correct styles

const AnniversaryBackground = () => {
  useEffect(() => {
    // 🌹 Create one petal
    const createPetal = () => {
      const petal = document.createElement("div");
      petal.className = "rose-petal";
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${5 + Math.random() * 5}s`; // random fall duration
      document.body.appendChild(petal);

      setTimeout(() => petal.remove(), 10000); // cleanup after animation
    };

    // 🎉 Start dropping petals
    const petalInterval = setInterval(createPetal, 250); // drop every 250ms

    // 🎨 Add romantic background once
    const bg = document.createElement("div");
    bg.className = "anniversary-background";
    document.body.appendChild(bg);

    // 🧹 Cleanup
    return () => {
      clearInterval(petalInterval);
      document.querySelectorAll(".rose-petal, .anniversary-background").forEach(el => el.remove());
    };
  }, []);

  return null;
};

export default AnniversaryBackground;
