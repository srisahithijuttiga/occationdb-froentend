import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Fireworks from "./Fireworks";
import "../styles/GreetingCardPage.css";

const GreetingCardPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [open, setOpen] = useState(false);
  const [audio, setAudio] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    let voiceAudio;
    fetch(`http://localhost:5000/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        setPerson(data);
        if (data.voice) {
          voiceAudio = new Audio(data.voice);
          voiceAudio.loop = false;
          setAudio(voiceAudio);
        }
      })
      .catch(() => alert("Failed to load greeting card"));

    return () => {
      if (voiceAudio) {
        voiceAudio.pause();
        voiceAudio.currentTime = 0;
      }
    };
  }, [personId]);

  const handleCardOpen = () => {
    setOpen(true);
    if (audio) {
      audio.play().catch((err) => console.log("Audio play blocked:", err));
    }
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 4000);
  };

  if (!person) return <p className="greeting-card-page">Loading...</p>;

  return (
    <div className={`greeting-card-page ${open ? "open" : ""}`}>
      {showFireworks && <Fireworks />}
      <p className="tap-text">open the card</p>
      <div className="card__container" onClick={handleCardOpen}>
        <div className="card">
          <div className="card__panel card__panel--front">
            <h1>A little something just for you.</h1>
          </div>
          <div className="card__panel card__panel--inside-left"></div>
          <div className="card__panel card__panel--inside-right">
            <p>{person.greeting}</p>
            <p>{person.customMessage}</p>
            <button
              className="btn-gallery"
              onClick={(e) => {
                e.stopPropagation();
                if (audio) audio.pause();
                navigate(`/gallery/${personId}`);
              }}
            >
              🎁 See What's Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingCardPage;