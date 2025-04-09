import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinalWrapPage = ({ username }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    fetchReviews();
    if (!SpeechRecognition) {
      setStatus('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, [username]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/${username}`);
      setReviews(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('No reviews found for this user.');
        setReviews([]);
      } else {
        console.error('Error fetching reviews:', error.response?.data?.error || error.message);
      }
    }
  };

  const submitReview = async () => {
    if (!message.trim()) {
      setStatus('Please enter a message.');
      return;
    }

    try {
      await axios.post('/api/reviews', { username, message });
      setStatus('Review submitted successfully!');
      setMessage('');
      fetchReviews();
    } catch (error) {
      setStatus('Error submitting review.');
    }
  };

  const deleteReview = async (index) => {
    try {
      await axios.delete(`/api/reviews/${index}`);
      setStatus('Review deleted successfully.');
      fetchReviews();
    } catch (error) {
      console.error('Delete error:', error);
      setStatus(error.response?.data?.error || 'Error deleting review.');
    }
  };

  const editReview = async (index) => {
    if (!editedMessage.trim()) {
      setStatus('Please enter a message.');
      return;
    }

    try {
      await axios.put(`/api/reviews/${index}`, {
        username,
        message: editedMessage,
      });
      setStatus('Review updated successfully.');
      setEditMode(null);
      setEditedMessage('');
      fetchReviews();
    } catch (error) {
      setStatus(error.response?.data?.error || 'Error updating review.');
    }
  };

  const startSpeechToText = () => {
    if (!recognition) return;

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening... Please speak now!');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('Speech recognition ended. Click to start again.');
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setStatus(`Error: ${event.error}. Please try again.`);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + ' ' + transcript);
      setStatus('Speech successfully converted to text!');
    };

    recognition.start();
  };

  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="review-section">
      <h1>Would you like to leave a note about how you felt about this?</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your review here..."
      />
      <span>
        <button onClick={submitReview}>Submit Review</button>
        <button onClick={startSpeechToText} disabled={isListening}>🎙 Start Speech to Text</button>
        <button onClick={() => handleTextToSpeech(message)} disabled={!message.trim()}>🔊 Text to Speech</button>
      </span>
      <p>{status}</p>

      <h2>Your Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              {editMode === index ? (
                <div>
                  <textarea
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                  />
                  <button onClick={() => editReview(index)}>Save</button>
                  <button onClick={() => setEditMode(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{review.message}</p>
                  <button onClick={() => { setEditMode(index); setEditedMessage(review.message); }}>Edit</button>
                  <button onClick={() => deleteReview(index)}>Delete</button>
                  <button onClick={() => handleTextToSpeech(review.message)}>🔊 Listen</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FinalWrapPage;