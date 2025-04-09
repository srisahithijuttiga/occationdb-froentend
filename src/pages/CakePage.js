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
  const hasStartedAudio = useRef(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // 🔊 Fetch and Play Background Voice
  const fetchVoice = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/persons/${personId}`);
      const data = await res.json();

      if (data.voice && !hasStartedAudio.current) {
        const audio = new Audio(data.voice);
        audio.loop = true;
        audio.volume = 1;
        audioRef.current = audio;
        playVoice();
        hasStartedAudio.current = true; // Prevent multiple plays
      }
    } catch (err) {
      console.warn("❌ Voice load failed:", err);
    }
  };

  const playVoice = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Audio play blocked:", err));
    }
  };

  // ✅ Blow Candles Using Voice
  const initializeSpeechRecognition = () => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported.");
      return;
    }

    if (recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      console.log("🎙 Say 'Blow Candles' or blow into the mic to blow them out.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("blow candles")) {
        blowAllCandles();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  // 🎤 Detect Blow Sound (Microphone Detection)
  const detectBlowSound = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Microphone access not supported.");
      return;
    }

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

        // Detect blowing sound
        if (volume > 50) {
          console.log("🎤 Blow detected!");
          blowAllCandles();
        }

        requestAnimationFrame(analyze);
      }

      analyze();
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  // 🕯 Blow Out Individual Candle
  const blowCandle = (index) => {
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    if (newCandles.every((c) => !c)) {
      setShowButton(true);
    }
  };

  // 🕯 Blow All Candles
  const blowAllCandles = () => {
    console.log("🎉 Candles blown out!");
    setCandles([false, false, false, false, false]);
    setShowButton(true);
  };

  // 🧨 Fireworks Effect on Page Load
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
        fireworks.push(new Firework(Math.random() * canvas.width, canvas.height, Math.random() * canvas.height / 2));
      }

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        if (firework.exploded) fireworks.splice(index, 1);
      });

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha <= 0) particles.splice(index, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  useEffect(() => {
    fetchVoice();
    initializeSpeechRecognition();
    detectBlowSound();

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [personId]);

  return (
    <div className="cake-page">
      <canvas ref={canvasRef} className="fireworks-canvas"></canvas>
      {!showButton && (
        <h1 className="cake-heading">
          🎂 Blow out the candles! Say <em>"Blow Candles!"</em> or Blow into the Mic.
        </h1>
      )}

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

      {showButton && (
        <button className="go-btn" onClick={() => navigate(`/gallery/${personId}`)}>
          🎁 Click me here
        </button>
      )}
    </div>
  );
};

export default CakePage;
