import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceCommandHandler = ({ personId, onNextPhoto, onPlayVideo }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Recognized Command:', transcript);

      if (transcript.includes('go to the cake page')) {
        navigate(`/cake/${personId}`);
      } else if (transcript.includes('show the next photo')) {
        onNextPhoto && onNextPhoto();
      } else if (transcript.includes('play the video')) {
        onPlayVideo && onPlayVideo();
      }
    };

    return () => recognition.stop();
  }, [navigate, personId, onNextPhoto, onPlayVideo]);

  const startListening = () => recognition.start();
  const stopListening = () => recognition.stop();

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>Start Listening</button>
      <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
      <p>{isListening ? 'Listening for commands...' : 'Click to start voice control'}</p>
    </div>
  );
};

export default VoiceCommandHandler;
