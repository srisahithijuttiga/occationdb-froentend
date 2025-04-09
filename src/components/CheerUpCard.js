// components/CheerUpCard.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CheerUpCard.css";

const CheerUpCard = ({ person }) => {
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
    <div className="cheer-card-container">
      <div className={`cheer-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <div className="front">🌈 You're Amazing!</div>
        <div className="back">
          <h2>Hey {person.name}!</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="sparkle-bg"></div>
    </div>
  );
};

export default CheerUpCard;
