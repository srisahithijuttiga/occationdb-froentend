import React, { useEffect } from "react";
import "../styles/GradBackground.css";

const GradBackground = () => {
  useEffect(() => {
    const createConfetti = (containerClass) => {
      const container = document.createElement("div");
      container.className = containerClass;

      const confettiHTML = new Array(150).fill("").map(() => {
        const rotation = -50 + Math.random() * 100;
        const color = `hsl(${Math.random() * 360},100%,70%)`;
        const rnd = Math.random();
        return `<i class="confetti" style="--rotation: ${rotation}deg; --color: ${color}; --rnd: ${rnd}"><span></span></i>`;
      }).join("");

      container.innerHTML = confettiHTML;
      document.body.appendChild(container);
    };

    createConfetti("confettis-top-left");
    createConfetti("confettis-bottom-right");

    return () => {
      document.querySelectorAll(".confettis-top-left, .confettis-bottom-right").forEach((el) => el.remove());
    };
  }, []);

  return null;
};

export default GradBackground;
