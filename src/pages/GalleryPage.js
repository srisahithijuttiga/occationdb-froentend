import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  startReactionCapture,
  stopReactionCapture,
} from "../utils/reactionCapture";

import "../styles/GalleryPage.css";

const GalleryPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [angle, setAngle] = useState(0);
  const carouselRef = useRef(null);
  const heartContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // 🖼️ Load gallery images
  useEffect(() => {
    fetch(`${API_URL}/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.gallery || []);
      });
  }, [personId, API_URL]);


  useEffect(() => {
    const hasPermission = sessionStorage.getItem("reactionConsent");
    if (hasPermission) {
      startReactionCapture(videoRef, "gallery"); // or greeting/gallery
    }
  }, []);
  

  // 🎠 Rotate carousel
  const rotateNext = () => {
    setAngle((prev) => prev - 360 / images.length);
  };
  const rotatePrev = () => {
    setAngle((prev) => prev + 360 / images.length);
  };

  useEffect(() => {
    if (!carouselRef.current || images.length === 0) return;

    const radius = 300;
    const theta = 360 / images.length;
    const items = carouselRef.current.children;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemAngle = theta * i;
      item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
    }

    carouselRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
  }, [images, angle]);

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
  useEffect(() => {
    startReactionCapture(videoRef, "gallery"); // or gallery/greeting
    // return () => stopReactionCapture(); // optional, usually leave running
  }, []);
  
  return (
    <div className="gallery-3d-wrapper">
      <div className="hearts-container" ref={heartContainerRef}></div>

      {consentGiven && (
        <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      )}

      <h2 className="gallery-title">💖 Your Memories</h2>

      <div className="carousel-scene">
        <div className="carousel" ref={carouselRef}>
          {images.map((img, index) => (
            <div className="carousel-item" key={index}>
              <img src={img.imageUrl} alt={`Memory ${index}`} />
              <div className="hover-text">{img.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button onClick={rotatePrev}>⬅️</button>
        <button onClick={rotateNext}>➡️</button>
      </div>
      {sessionStorage.getItem("reactionConsent") && (
  <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
)}


      <button
        className="see-surprise-btn"
        onClick={() => navigate(`/surprise/final/${personId}`)}
      >
        🎁 See what's there...
      </button>
    </div>
  );
};

export default GalleryPage;
