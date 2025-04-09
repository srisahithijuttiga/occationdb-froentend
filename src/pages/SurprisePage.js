import React, { useState, useEffect } from "react";
import { useParams , useNavigate} from "react-router-dom";
import "../styles/SurprisePage.css";

const SurprisePage = () => {
  const navigate = useNavigate();
  const { personId } = useParams();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos || []);
      });
  }, [personId]);

  return (
    <div className={`surprise-page ${selectedVideo ? "blurred" : ""}`}>
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

      <button onClick={() => navigate(`/final/${personId}`)}>✨ one last click</button>

      
    </div>
  );
};

export default SurprisePage;
