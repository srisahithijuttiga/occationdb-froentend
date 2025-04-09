// components/themes/JobCongratsCard.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/JobCongratsCard.css";

const JobCongratsCard = ({ person }) => {
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

  const handleCardFlip = () => {
    setFlipped(true);
  };

  const handleGoToGallery = () => {
    navigate(`/gallery/${person.id}`);
  };

  return (
    <div className="job-card-container">
      <div className={`card ${flipped ? "flipped" : ""}`} onClick={handleCardFlip}>
        <div className="front">🎉 New Job 🎉</div>
        <div className="back">
          <h2>Congratulations {person.name}!</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="confetti-bg"></div>
    </div>
  );
};

export default JobCongratsCard;
