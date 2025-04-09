// components/AnniversaryGreetingCard.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AnniversaryGreetingCard.css";

const AnniversaryGreetingCard = ({ person }) => {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (person.voice) {
      const audio = new Audio(person.voice);
      audioRef.current = audio;
      audio.play();
    }
  }, [person]);

  const handleFlip = () => {
    setFlipped(true);
  };

  const handleGoToGallery = () => {
    navigate(`/gallery/${person.id}`);
  };

  return (
    <div className="anniversary-card-container">
      <div className={`anniversary-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <div className="front">🌹 Happy Anniversary 🌹</div>
        <div className="back">
          <h2>Dear {person.name},</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="rose-petals-bg"></div>
    </div>
  );
};

export default AnniversaryGreetingCard;
