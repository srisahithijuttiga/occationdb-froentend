import React, { useEffect, useRef } from "react";

const Fireworks = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const heart = "\u2764\uFE0F"; // ❤️ Unicode heart symbol
    ctx.font = "20px sans-serif";

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height / 2;
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 3 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: Math.random() * 10 + 10
        });
      }
    };

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;
      });
      particles = particles.filter((p) => p.alpha > 0);
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(heart, p.x, p.y);
      });
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    createFirework();
    createFirework();
    createFirework();
    animate();

    const interval = setInterval(createFirework, 1200); // Continuous firework particles

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <canvas className="firecracker-canvas" ref={canvasRef} />;
};

export default Fireworks;
