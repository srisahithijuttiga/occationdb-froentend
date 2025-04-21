import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  startReactionCapture,
  stopReactionCapture,
} from "../utils/reactionCapture";
import "../styles/CakePage.css";

const CakePage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [showButton, setShowButton] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const hasStartedAudio = useRef(false);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // 🔊 Play Background Voice
  const fetchVoice = async () => {
    try {
      const res = await fetch(`${API_URL}/persons/${personId}`);
      const data = await res.json();

      if (data.voice && !hasStartedAudio.current) {
        const audio = new Audio(data.voice);
        audio.loop = true;
        audio.volume = 1;
        audioRef.current = audio;
        audio.play().catch((err) => console.warn("Audio blocked:", err));
        hasStartedAudio.current = true;
      }
    } catch (err) {
      console.warn("❌ Voice load failed:", err);
    }
  };

  // 🎤 Voice Command: "Blow Candles"
  const initializeSpeechRecognition = () => {
    if (!SpeechRecognition || recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes("blow candles")) {
        blowAllCandles();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // 🎤 Detect Blow Sound
  const detectBlowSound = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.fftSize);

      function analyze() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        if (volume > 50) blowAllCandles();
        requestAnimationFrame(analyze);
      }

      analyze();
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  // 🕯 Logic
  const blowCandle = (index) => {
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);
    if (newCandles.every((c) => !c)) setShowButton(true);
  };

  const blowAllCandles = () => {
    setCandles([false, false, false, false, false]);
    setShowButton(true);
  };

  // 🎆 Fireworks
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
        this.speed = 4;
        this.exploded = false;
      }

      update() {
        if (this.y > this.targetY) {
          this.y -= this.speed;
        } else if (!this.exploded) {
          for (let i = 0; i < 50; i++) {
            particles.push(new Particle(this.x, this.y));
          }
          this.exploded = true;
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
        fireworks.push(new Firework(Math.random() * canvas.width, canvas.height, Math.random() * canvas.height / 2));
      }

      fireworks.forEach((f, i) => {
        f.update();
        f.draw(ctx);
        if (f.exploded) fireworks.splice(i, 1);
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);
  useEffect(() => {
    const hasPermission = sessionStorage.getItem("reactionConsent");
    if (hasPermission) {
      startReactionCapture(videoRef, "cake"); // or greeting/gallery
    }
  }, []);
  
  
  // 🔄 Startup / Cleanup
  useEffect(() => {
    fetchVoice();
    initializeSpeechRecognition();
    detectBlowSound();
    startReactionCapture(videoRef, "cake");

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (recognitionRef.current) recognitionRef.current.stop();
      // stopReactionCapture();
    };
  }, [personId]);

  return (
    <div className="cake-page">
      <canvas ref={canvasRef} className="fireworks-canvas"></canvas>

      {!showButton && (
        <h1 className="cake-heading">
          🎂 Blow out the candles! Say <em>"Blow Candles!"</em> or blow into the Mic.
        </h1>
      )}

      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

      <div className="cake-container">
        <div className="candles">
          {candles.map((lit, index) => (
            <div key={index} className={`candle ${!lit ? "blown" : ""}`} onClick={() => blowCandle(index)}>
              {lit && <div className="flame"></div>}
            </div>
          ))}
        </div>
        <div className="cake-body"></div>
      </div>
      {sessionStorage.getItem("reactionConsent") && (
  <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
)}


      {showButton && (
        <button className="go-btn" onClick={() => navigate(`/gallery/${personId}`)}>
          🎁 Click me here
        </button>
      )}
    </div>
  );
};

export default CakePage;
