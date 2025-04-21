import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [theme, setTheme] = useState("Birthday");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/persons`)
      .then((res) => res.json())
      .then((data) => setPersons(data))
      .catch(() => alert("Failed to fetch persons"));
  }, []);

  
  // const copyLink = (id) => {
  //   const link = `${window.location.origin}/surprise/${id}`;
  //   navigator.clipboard.writeText(link)
  //     .then(() => alert("Link copied to clipboard!"))
  //     .catch(() => alert("Failed to copy link"));
  // };
  const copyLink = (id) => {
    const link = `${window.location.origin}/surprise/${id}`;
  
    // ✅ Fallback that works everywhere
    const textarea = document.createElement("textarea");
    textarea.value = link;
    textarea.style.position = "fixed";   // prevent scroll jump
    textarea.style.opacity = "0";        // invisible to user
    document.body.appendChild(textarea);
    textarea.select();
  
    try {
      const success = document.execCommand("copy");
      if (success) {
        alert("Link copied to clipboard!");
      } else {
        alert("Copy failed. Please copy manually.");
      }
    } catch (err) {
      alert("Clipboard operation not supported.");
    }
  
    document.body.removeChild(textarea);
  };
  
  const manageGallery = (id) => {
    navigate(`/admin/gallery/${id}/manage`);
  };

  const addPerson = async () => {
    if (!name || !wish) {
      alert("Please enter both name and message");
      return;
    }

    const newId = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newPerson = {
      id: newId,
      name,
      greeting: wish,
      theme,
      customMessage: "",
      reviews: [],
      showReviews: false,
    };

    try {
      const res = await fetch(`${API_URL}/api/persons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson),
      });
      const added = await res.json();
      setPersons((prev) => [...prev, added]);
      setName("");
      setWish("");
      setTheme("Birthday");
    } catch (err) {
      alert("Failed to add person.");
    }
  };

  const deletePerson = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/persons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPersons(persons.filter((p) => p.id !== id));
      } else {
        alert("Delete failed on server.");
      }
    } catch (err) {
      alert("Failed to delete person.");
    }
  };

  const fetchReviews = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`);
      const data = await res.json();
      const updatedPersons = persons.map((p) =>
        p.id === id ? { ...p, reviews: data, showReviews: true } : p
      );
      setPersons(updatedPersons);
    } catch (err) {
      alert("Failed to fetch reviews.");
    }
  };

  const toggleReviewVisibility = (id) => {
    const updated = persons.map((p) =>
      p.id === id ? { ...p, showReviews: !p.showReviews } : p
    );
    setPersons(updated);
  };

  const speakReview = (text) => {
    if (!text) return alert("No text to speak.");
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const deleteReview = async (personId, reviewId) => {
    try {
      await fetch(`${API_URL}/api/reviews/${personId}/${reviewId}`, {
        method: "DELETE",
      });
      fetchReviews(personId); // Refresh after delete
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">🎉 Admin Dashboard</h2>

      <div className="add-person card">
        <h3>Add a New Surprise</h3>
        <input
          className="input"
          type="text"
          placeholder="Person Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Greeting Message"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
        />
        <label>Occasion Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="Birthday">🎂 Birthday</option>
          <option value="Anniversary">💍 Anniversary</option>
          <option value="CheerUp">🌟 Cheer Up</option>
          <option value="JobCongrats">🎉 Job Congratulations</option>
          <option value="LoveNote">❤️ Love Note</option>
          <option value="SorryNote">💔 Sorry Note</option>
          <option value="Grad">🎓 Graduation</option>
        </select>
        <button className="btn primary" onClick={addPerson}>
          Add Person
        </button>
      </div>

      <div className="person-list-wrapper">
        <div className="person-list">
          <h3>👥 Created Wishes</h3>
          {persons.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <div className="cards-container">
              {persons.map((person) => (
                <div key={person.id} className="person-card">
                  <h4>{person.name}</h4>
                  <p>{person.greeting}</p>
                  <button className="btn small" onClick={() => copyLink(person.id)}>🔗 Copy Link</button>
                  <button className="btn small" onClick={() => manageGallery(person.id)}>🖼 Manage Gallery</button>
                  <button className="btn small" onClick={() => fetchReviews(person.id)}>
                    📖 {person.showReviews ? "Hide Reviews" : "Show Reviews"}
                  </button>
                  <button className="btn small danger" onClick={() => deletePerson(person.id)}>❌ Delete</button>

                  {person.showReviews && (
                    <div className="reviews">
                      {person.reviews.length > 0 ? (
                        person.reviews.map((review, index) => (
                          <div key={review.id || index} className="review-card">
                            <h5>Review {index + 1}</h5>
                            <p>{review.message}</p>
                            <button className="btn small" onClick={() => speakReview(review.message)}>🔊 Listen</button>
                            <button className="btn small danger" onClick={() => deleteReview(person.id, review.id)}>❌ Delete</button>
                            <button className="btn small" onClick={() => toggleReviewVisibility(person.id)}>❌ Close</button>
                          </div>
                        ))
                      ) : (
                        <p>No reviews available.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
