import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Fireworks from "./Fireworks";
import GradBackground from "./GradBackground";
import JobBackground from "./JobBackground";
import AnniversaryBackground from "./AnniversaryBackground";
import CheerUpBackground from "./CheerUpBackground";
import LoveFireworks from "./LoveFireworks";

import {
  startReactionCapture,
  stopReactionCapture,
} from "../utils/reactionCapture";

import "../styles/GreetingCardPage.css";

const GreetingCardPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [open, setOpen] = useState(false);
  const [audio, setAudio] = useState(null);
  const [theme, setTheme] = useState("Birthday");
  const [showFireworks, setShowFireworks] = useState(true);
  const recognitionRef = useRef(null);
  const audioPlayedRef = useRef(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const videoRef = useRef(null);
  const [consentGiven, setConsentGiven] = useState(false);

  // 🔄 Fetch data and background voice
  useEffect(() => {
    let voiceAudio;
    fetch(`${API_URL}/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        setPerson(data);
        setTheme(data.theme);

        if (data.voice && !audioPlayedRef.current) {
          voiceAudio = new Audio(data.voice);
          voiceAudio.loop = false;
          setAudio(voiceAudio);
          voiceAudio.play().catch((err) => console.warn("Audio play blocked:", err));
          audioPlayedRef.current = true;
        }
      })
      .catch(() => alert("Failed to load greeting card"));

    setTimeout(() => setShowFireworks(false), 5000);

    return () => {
      if (voiceAudio) {
        voiceAudio.pause();
        voiceAudio.currentTime = 0;
      }
    };
  }, [personId, API_URL]);


  useEffect(() => {
    const hasPermission = sessionStorage.getItem("reactionConsent");
    if (hasPermission) {
      startReactionCapture(videoRef, "greeting"); // or greeting/gallery
    }
  }, []);
  

  // 🗣️ Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Heard:", transcript);

      if (transcript.includes("open card")) {
        handleCardOpen();
      }
    };

    recognitionRef.current.start();

    return () => recognitionRef.current.stop();
  }, []);
  useEffect(() => {
    startReactionCapture(videoRef, "greeting"); // or gallery/greeting
    // return () => stopReactionCapture(); // optional, usually leave running
  }, []);
  
  const handleCardOpen = () => {
    setOpen(true);
    if (audio && !audioPlayedRef.current) {
      audio.play().catch((err) => console.warn("Audio play error:", err));
      audioPlayedRef.current = true;
    }
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 5000);
  };

  if (!person) return <p className="greeting-card-page">Loading...</p>;

  return (
    <div
      className={`greeting-card-page ${open ? "open" : ""}
      ${theme === "Grad" ? "grad" : ""}
      ${theme === "JobCongrats" ? "JobCongrats" : ""}
      ${theme === "Anniversary" ? "no-black-bg" : ""}`}
    >
      {theme === "Grad" && <GradBackground />}
      {theme === "JobCongrats" && <JobBackground />}
      {theme === "Anniversary" && <AnniversaryBackground />}
      {theme === "CheerUp" && <CheerUpBackground />}

      {showFireworks && (
        <>
          {theme === "Birthday" && <Fireworks />}
          {(theme === "LoveNote" || theme === "SorryNote") && <Fireworks />}
        </>
      )}

      {consentGiven && <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />}

      {!open && <div className="tap-text cardheading">Say "open card" or click to open!</div>}

      {open && (
        <div className="cardgreeting-banner">
          <p className="cardgreeting">{person.greeting}</p>
        </div>
      )}

      <div className="card__container" onClick={handleCardOpen}>
        <div className="card">
          <div className="card__panel card__panel--front">
            <h1 className="cardheading">A little something just for you.</h1>
          </div>
          <div className="card__panel card__panel--inside-left"></div>
          <div className="card__panel card__panel--inside-right">
            <p className="cardgreeting">{person.customMessage}</p>
            {sessionStorage.getItem("reactionConsent") && (
  <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
)}



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
