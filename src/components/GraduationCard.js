// components/GraduationCard.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GraduationCard.css";

const GraduationCard = ({ person }) => {
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
    <div className="graduation-card-container">
      <div className={`graduation-card ${flipped ? "flipped" : ""}`} onClick={handleFlip}>
        <div className="front">🎓 You Did It! 🎓</div>
        <div className="back">
          <h2>Congratulations {person.name}!</h2>
          <p>{person.greeting}</p>
          <button onClick={handleGoToGallery}>Go to Gallery</button>
        </div>
      </div>
      <div className="caps-flying-bg"></div>
    </div>
  );
};

export default GraduationCard;
