import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/GalleryManager.css";

const GalleryManager = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [imageText, setImageText] = useState("");
  const [videoName, setVideoName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Fetch person data from backend
  const fetchPerson = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/persons/${personId}`);
      console.log("Fetched person data:", res.data); // Debugging
      setPerson(res.data);
    } catch (error) {
      console.error("Error fetching person data:", error);
      alert("Failed to fetch person data");
    }
  };

  useEffect(() => {
    fetchPerson();
  }, [personId]);

  const handleImageUpload = async () => {
    if (!selectedImage) return alert("Please select an image");
    const reader = new FileReader();
    reader.onloadend = async () => {
      await axios.post(`http://localhost:5000/api/persons/${personId}/gallery`, {
        imageUrl: reader.result, // Upload base64 string
        text: imageText,
      });
      setImageText("");
      setSelectedImage(null);
      fetchPerson(); // Re-fetch to display uploaded media
    };
    reader.readAsDataURL(selectedImage); // Convert image to base64
  };

  const handleVideoUpload = async () => {
    if (!selectedVideo) return alert("Please select a video");
    const reader = new FileReader();
    reader.onloadend = async () => {
      await axios.post(`http://localhost:5000/api/persons/${personId}/videos`, {
        videoUrl: reader.result, // Upload base64 video data
        name: videoName,
      });
      setVideoName("");
      setSelectedVideo(null);
      fetchPerson(); // Re-fetch to display uploaded media
    };
    reader.readAsDataURL(selectedVideo); // Convert video to base64
  };

  const handleVoiceUpload = async () => {
    if (!selectedVoice) return alert("Please select a voice file");
    const reader = new FileReader();
    reader.onloadend = async () => {
      await axios.post(`http://localhost:5000/api/persons/${personId}/voice`, {
        voice: reader.result, // Upload base64 voice data
      });
      setSelectedVoice(null);
      fetchPerson(); // Re-fetch to display uploaded media
    };
    reader.readAsDataURL(selectedVoice); // Convert audio to base64
  };

  const deleteImage = async (index) => {
    await axios.delete(`http://localhost:5000/api/persons/${personId}/gallery/${index}`);
    fetchPerson(); // Re-fetch to display updated media
  };

  const deleteVideo = async (index) => {
    await axios.delete(`http://localhost:5000/api/persons/${personId}/videos/${index}`);
    fetchPerson(); // Re-fetch to display updated media
  };

  const deleteVoice = async () => {
    await axios.delete(`http://localhost:5000/api/persons/${personId}/voice`);
    fetchPerson(); // Re-fetch to display updated media
  };

  if (!person) return <div className="gallery-manager">Loading...</div>;

  return (
  
    <div className="gallery-manager">
      <h2>📸 Manage Gallery for {person.name}</h2>
      {/* <div style={{ height: '2000px', backgroundColor: '#f0f0f0' }}>
       This is some extra content to test scrolling. Add more content here to make the page overflow.
      </div> */}
      {/* Display Custom Message Editor */}
      {person.theme !== "Birthday" && (
        <div className="custom-message-editor">
          <h4>💌 Custom Message</h4>
          <textarea
            className="input"
            rows="4"
            placeholder="Write something special..."
            value={person.customMessage || ""}
            onChange={(e) => setPerson({ ...person, customMessage: e.target.value })}
          />
          <button
            className="btn primary"
            onClick={async () => {
              await axios.post(`http://localhost:5000/api/persons/${personId}/custom-message`, {
                message: person.customMessage,
              });
              alert("Custom message saved!");
              fetchPerson();
            }}
          >
            💾 Save Message
          </button>
          <button
            className="btn danger"
            onClick={async () => {
              const confirm = window.confirm("Delete the custom message?");
              if (!confirm) return;
              await axios.delete(`http://localhost:5000/api/persons/${personId}/custom-message`);
              alert("Custom message deleted!");
              fetchPerson();
            }}
            style={{ marginLeft: "10px" }}
          >
            🗑️ Delete Message
          </button>
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-container">
        {/* Upload Image */}
        <div className="upload-box">
          <h3>🖼️ Upload Image</h3>
          <input
            type="text"
            placeholder="Image text"
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
          <button onClick={handleImageUpload}>Upload Image</button>
        </div>

        {/* Upload Video */}
        <div className="upload-box">
          <h3>🎥 Upload Video</h3>
          <input
            type="text"
            placeholder="Video name"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
          <input type="file" accept="video/*" onChange={(e) => setSelectedVideo(e.target.files[0])} />
          <button onClick={handleVideoUpload}>Upload Video</button>
        </div>

        {/* Upload Voice */}
        <div className="upload-box">
          <h3>🔊 Upload Voice</h3>
          <input type="file" accept="audio/*" onChange={(e) => setSelectedVoice(e.target.files[0])} />
          <button onClick={handleVoiceUpload}>Upload Voice</button>
        </div>
      </div>

      {/* Display Uploaded Media */}
      <h3>📸 Uploaded Images</h3>
      <div className="media-gallery">
        {person.gallery.map((img, i) => (
          <div key={i} className="media-item">
            <img src={img.imageUrl} alt="Uploaded" className="gallery-image" />
            <p>{img.text}</p>
            <button onClick={() => deleteImage(i)}>🗑️ Delete</button>
          </div>
        ))}
      </div>

      <h3>🎞️ Uploaded Videos</h3>
      <div className="media-gallery">
        {person.videos.map((vid, i) => (
          <div key={i} className="media-item">
            <video src={vid.videoUrl} controls className="gallery-video" />
            <p>{vid.name}</p>
            <button onClick={() => deleteVideo(i)}>🗑️ Delete</button>
          </div>
        ))}
      </div>

      <h3>🔉 Voice Message</h3>
      {person.voice ? (
        <div>
          <audio controls src={person.voice} className="voice-audio" />
          <br />
          <button onClick={deleteVoice}>🗑️ Delete Voice</button>
        </div>
      ) : (
        <p>No voice uploaded yet.</p>
      )}
    </div>
  );
};

export default GalleryManager;
