import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [theme, setTheme] = useState("Birthday");

  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/persons")
      .then((res) => res.json())
      .then((data) => setPersons(data))
      .catch(() => alert("Failed to fetch persons"));
  }, []);

  const generateId = (name) => {
    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    return `${safeName}-${Date.now()}`;
  };

  const addPerson = async () => {
    if (!name || !wish) {
      alert("Please enter both name and message");
      return;
    }

    const newId = generateId(name);
    const newPerson = {
      id: newId,
      name,
      greeting: wish,
      theme,
      customMessage: "", // default
    };

    try {
      const res = await fetch("http://localhost:5000/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson),
      });

      const added = await res.json();
      setPersons([...persons, added]);
      setName("");
      setWish("");
      setTheme("Birthday");
    } catch (err) {
      alert("Failed to add person.");
    }
  };

  const deletePerson = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this person?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:5000/api/persons/${id}`, {
        method: "DELETE",
      });
      setPersons(persons.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete person.");
    }
  };

  const copyLink = (person) => {
    const link = `${window.location.origin}/surprise/${person.id}`;
    navigator.clipboard.writeText(link);
    alert("🎉 Surprise link copied!");
  };

  const manageGallery = (id) => {
    navigate(`/admin/gallery/${id}/manage`);
  };

  const handleSelect = (person) => {
    setSelectedPersonId(person.id);
    setCustomMessage(person.customMessage || "");
  };

  const updateCustomMessage = async () => {
    try {
      await fetch(`http://localhost:5000/api/persons/${selectedPersonId}/custom-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: customMessage }),
      });

      // Update local state
      const updated = persons.map((p) =>
        p.id === selectedPersonId ? { ...p, customMessage } : p
      );
      setPersons(updated);
      alert("✅ Custom message saved!");
    } catch (err) {
      alert("Failed to update message.");
    }
  };

  const deleteCustomMessage = async () => {
    const confirm = window.confirm("Delete the custom message?");
    if (!confirm) return;

    try {
      await fetch(`http://localhost:5000/api/persons/${selectedPersonId}/custom-message`, {
        method: "DELETE",
      });

      // Update local state
      const updated = persons.map((p) =>
        p.id === selectedPersonId ? { ...p, customMessage: "" } : p
      );
      setPersons(updated);
      setCustomMessage("");
      alert("🗑️ Custom message deleted.");
    } catch (err) {
      alert("Failed to delete message.");
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

        <label style={{ marginTop: "10px", fontWeight: "500" }}>Occasion Theme</label>
        <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="Birthday">🎂 Birthday</option>
          <option value="Anniversary">💍 Anniversary</option>
          <option value="CheerUp">🌟 Cheer Up</option>
          <option value="JobCongrats">🎉 Job Congratulations</option>
          <option value="LoveNote">❤️ Love Note</option>
        </select>

        <button className="btn primary" onClick={addPerson}>
          Add Person
        </button>
      </div>

      <div className="person-list">
        <h3>👥 Created Wishes</h3>
        {persons.length === 0 ? (
          <p className="no-data">No entries yet.</p>
        ) : (
          <div className="cards-container">
            {persons.map((person) => (
              <div
                key={person.id}
                className={`person-card ${selectedPersonId === person.id ? "selected" : ""}`}
                onClick={() => handleSelect(person)}
              >
                <h4>{person.name}</h4>
                <p>{person.greeting}</p>
                <p style={{ fontStyle: "italic", color: "#888" }}>🎭 Theme: {person.theme}</p>
                <div className="actions">
                  <button className="btn small" onClick={() => copyLink(person)}>
                    🔗 Copy Link
                  </button>
                  <button className="btn small" onClick={() => manageGallery(person.id)}>
                    🖼️ Manage Gallery
                  </button>
                  <button className="btn small danger" onClick={() => deletePerson(person.id)}>
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom message for selected person */}
      {selectedPersonId && (
        <div className="add-person card" style={{ marginTop: "40px" }}>
          <h3>💌 Custom Message</h3>
          <textarea
            className="input"
            rows="4"
            placeholder="Write something sweet for this person..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          <button className="btn primary" onClick={updateCustomMessage}>
            💾 Save Message
          </button>
          <button className="btn danger" onClick={deleteCustomMessage} style={{ marginTop: "10px" }}>
            🗑️ Delete Message
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
