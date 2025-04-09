// components/SorryNote.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SorryNote.css";

const SorryNote = ({ person }) => {
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
    <div className="sorry-card-container">
      <div className={`sorry-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <div className="front">😔 I'm Sorry</div>
        <div className="back">
          <h2>Dear {person.name},</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="rain-bg"></div>
    </div>
  );
};

export default SorryNote;
