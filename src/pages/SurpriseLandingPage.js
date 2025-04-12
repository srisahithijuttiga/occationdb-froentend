import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SurpriseLandingPage.css";

const SurpriseLandingPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const heartContainerRef = useRef(null); // ✅ FIX: moved outside useEffect

  const actualId = personId?.replace("-surprise", "");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/persons`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === actualId);
        setPerson(found);
      });
  }, [actualId]);

  // ✅ Floating Hearts
  useEffect(() => {
    let heartCount = 0;
    const maxHearts = 15;

    const createHeart = () => {
      if (!heartContainerRef.current || heartCount >= maxHearts) return;

      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${4 + Math.random() * 3}s`;
      heart.style.opacity = `${0.5 + Math.random() * 0.4}`;

      heartContainerRef.current.appendChild(heart);
      heartCount++;

      setTimeout(() => {
        heart.remove();
        heartCount--;
      }, 7000);
    };

    const interval = setInterval(createHeart, 800);
    return () => clearInterval(interval);
  }, []);

  // ✅ Confetti ribbons
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "ribbon-canvas";
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      pointerEvents: "none",
      zIndex: "1",
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Ribbon {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 6 + 4;
        this.speed = Math.random() * 1.5 + 0.5;
        this.swing = Math.random() * 30 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.05 + 0.01;
        this.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
      }
      update() {
        this.angle += this.angleSpeed;
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        if (this.y > height + 20) this.reset();
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.sin(this.angle) * this.swing, this.y + 20);
        ctx.stroke();
      }
    }

    const ribbons = Array.from({ length: 80 }, () => new Ribbon());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ribbons.forEach((r) => {
        r.update();
        r.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!personId || !actualId) {
    return <div className="landing-loading">Invalid link. Missing person ID.</div>;
  }

  if (!person) {
    return <div className="landing-loading">Loading your surprise...</div>;
  }

  return (
    <div className="surprise-landing">
      <div className="celebration-background"></div>
      <div ref={heartContainerRef} className="hearts-container"></div>
      <div className="surprise-content">
        <h1>{person.greeting}</h1>
        <h2>{person.name} 💖</h2>
        <button 
        onClick={() => navigate(`/cake/${person.id}`)}>Let's Go 🎉
        
        </button>
        
      </div>
    </div>
  );
};

export default SurpriseLandingPage;
