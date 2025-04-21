import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SurprisePage.css";
import {
  startReactionCapture,
  stopReactionCapture,
} from "../utils/reactionCapture";

const SurprisePage = () => {
  const navigate = useNavigate();
  const { personId } = useParams();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const videoRef = useRef(null); // ✅ Properly declared
  const [consentGiven, setConsentGiven] = useState(false);

  // 📦 Load videos
  useEffect(() => {
    fetch(`${API_URL}/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
      });
  }, [personId, API_URL]);



  useEffect(() => {
    const hasPermission = sessionStorage.getItem("reactionConsent");
    if (hasPermission) {
      startReactionCapture(videoRef, "video"); // or greeting/gallery
    }
  }, []);
  

  
  return (
    <div className={`surprise-page ${selectedVideo ? "blurred" : ""}`}>
      {consentGiven && <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />}

      <h2 className="title">🎊 Your Special Surprise Videos 🎥</h2>

      <div className="video-list">
        {videos.map((vid, index) => (
          <button
            key={index}
            className="video-name-btn"
            onClick={() => setSelectedVideo(vid.videoUrl || vid)}
          >
            ▶️ {vid.name || `Video ${index + 1}`}
          </button>
        ))}
        <p className="">Hope you had a great day 💖😊</p>
      </div>

      {selectedVideo && (
        <div className="video-popup">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setSelectedVideo(null)}>
              ✖
            </button>
            <video src={selectedVideo} controls autoPlay className="popup-video" />
          </div>
        </div>
      )}
      {sessionStorage.getItem("reactionConsent") && (
  <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
)}


        <button
          onClick={() => {
            stopReactionCapture(); // ✅ Only here
            sessionStorage.removeItem("reactionConsent");
            navigate(`/final/${personId}`);
          }}
        >
          ✨ One last click
        </button>

    </div>
  );
};

export default SurprisePage;
