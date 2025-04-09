import React, { useState, useEffect } from 'react';

const BlowOutCandlesByVoice = ({ onBlowOut }) => {
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
      console.log('Recognized:', transcript);
      if (transcript.includes('happy birthday')) {
        onBlowOut();
      }
    };

    return () => recognition.stop();
  }, [onBlowOut]);

  const startListening = () => recognition.start();
  const stopListening = () => recognition.stop();

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>Start Listening</button>
      <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
      <p>{isListening ? 'Listening for "Happy Birthday!"' : 'Click to start listening'}</p>
    </div>
  );
};

export default BlowOutCandlesByVoice;
