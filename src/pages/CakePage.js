import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CakePage.css";

const CakePage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [showButton, setShowButton] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // 🎆 Fireworks animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    class Firework {
      constructor(x, y, targetY) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.speed = 2;
        this.exploded = false;
      }

      update() {
        if (this.y > this.targetY) {
          this.y -= this.speed;
        } else if (!this.exploded) {
          this.explode();
          this.exploded = true;
        }
      }

      explode() {
        for (let i = 0; i < 50; i++) {
          particles.push(new Particle(this.x, this.y));
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 5 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = 1;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.02;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(
          new Firework(
            Math.random() * canvas.width,
            canvas.height,
            Math.random() * canvas.height / 2
          )
        );
      }

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        if (firework.exploded) {
          fireworks.splice(index, 1);
        }
      });

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha <= 0) {
          particles.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  // 🔊 Fetch voice from backend and play on click
  useEffect(() => {
    const fetchVoice = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/persons/${personId}`);
        const data = await res.json();
        if (data.voice) {
          const audio = new Audio(data.voice);
          audio.loop = true;
          audio.volume = 1;
          audioRef.current = audio;
        }
      } catch (err) {
        console.warn("❌ Voice load failed:", err);
      }
    };

    fetchVoice();

    const playOnClick = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.warn("Audio play blocked:", err));
      }
      window.removeEventListener("click", playOnClick);
    };

    window.addEventListener("click", playOnClick);

    return () => {
      if (audioRef.current) audioRef.current.pause();
      window.removeEventListener("click", playOnClick);
    };
  }, [personId]);

  const blowCandle = (index) => {
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    if (newCandles.every((c) => !c)) {
      setShowButton(true);
    }
  };

  return (
    <div className="cake-page">
      <canvas ref={canvasRef} className="fireworks-canvas"></canvas>

      {!showButton && (
        <h1 className="cake-heading">🎂 Blow out the candles!</h1>
      )}

      <div className="cake-container">
        <div className="candles">
          {candles.map((lit, index) => (
            <div
              key={index}
              className={`candle ${!lit ? "blown" : ""}`}
              onClick={() => blowCandle(index)}
            >
              {lit && <div className="flame"></div>}
            </div>
          ))}
        </div>
        <div className="cake-body"></div>
      </div>

      {showButton && (
        <button className="go-btn" onClick={() => navigate(`/gallery/${personId}`)}>
          🎁 Click me here
        </button>
      )}
    </div>
  );
};

export default CakePage;
