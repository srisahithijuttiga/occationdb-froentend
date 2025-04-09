// components/LoveNoteCard.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoveNoteCard.css";

const LoveNoteCard = ({ person }) => {
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
    <div className="love-card-container">
      <div className={`love-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <div className="front">💖 A Little Note...</div>
        <div className="back">
          <h2>To {person.name},</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="hearts-bg"></div>
    </div>
  );
};

export default LoveNoteCard;
