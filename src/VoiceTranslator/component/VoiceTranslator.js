import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaSignLanguage, FaSpinner } from 'react-icons/fa';
import { MdTranslate, MdClear } from 'react-icons/md';
import './VoiceTranslator.css';

const VoiceTranslator = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const signImages = useRef(require.context('./Signs', false, /\.(png|jpe?g|svg)$/));

  const ASSEMBLY_API_KEY = 'dd8ee4451cf6418e88a8cb329b14a23a'; // Store this securely!

  const translateToSigns = async (text) => {
    setIsTranslating(true);
    setError(null);

    try {
     

      const words = text
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[^a-z]/g, ''))
        .filter(Boolean);

      setTranslation(words);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const renderSignCards = (words) => (
    <div className="sign-card-container">
      {words.map((word, index) => {
        try {
          const image = signImages.current(`./${word}.png`);
          return <img key={index} src={image} alt={`Sign for ${word}`} className="sign-card" />;
        } catch {
          return <div key={index} className="sign-card missing-sign">{word}</div>;
        }
      })}
    </div>
  );

  const startListening = async () => {
    setTranscript('');
    setTranslation([]);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAssemblyTranscription(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setError('Microphone access denied or not supported.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleAssemblyTranscription = async (audioBlob) => {
    setIsTranslating(true);
    try {
      // 1. Upload audio
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
        body: audioBlob,
      });
      const { upload_url } = await uploadResponse.json();

      // 2. Request transcription
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          authorization: ASSEMBLY_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ audio_url: upload_url }),
      });
      const { id } = await transcriptResponse.json();

      // 3. Poll for result
      let completedTranscript = '';
      while (true) {
        const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { authorization: ASSEMBLY_API_KEY },
        });
        const data = await pollingRes.json();

        if (data.status === 'completed') {
          completedTranscript = data.text;
          break;
        } else if (data.status === 'error') {
          throw new Error(data.error);
        }
        await new Promise((res) => setTimeout(res, 2000));
      }

      setTranscript(completedTranscript);
      translateToSigns(completedTranscript);
    } catch (err) {
      console.error('AssemblyAI error:', err);
      setError('Speech recognition failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const clearAll = () => {
    setTranscript('');
    setTranslation([]);
    setError(null);
    setIsListening(false);
  };

  return (
    <div className="translator-container">
      <div className="translator-header">
        <h2 className="translator-title">
          <FaSignLanguage className="title-icon" />
          Voice to Sign Language Translator
        </h2>
        <p className="translator-subtitle">
          Speak naturally and see the sign language translation in real-time
        </p>
      </div>

      <div className="translator-content">
        <div className="input-section">
          <div className="voice-controls">
            <button
              className={`mic-button ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isTranslating}
            >
              {isListening ? (
                <>
                  <FaStop className="mic-icon" />
                  Stop Listening
                </>
              ) : (
                <>
                  <FaMicrophone className="mic-icon" />
                  Start Speaking
                </>
              )}
            </button>

            <button
              className="clear-button"
              onClick={clearAll}
              disabled={isListening || isTranslating}
            >
              <MdClear className="clear-icon" />
              Clear
            </button>
          </div>

          <div className="transcript-box">
            <h3 className="section-label">Your Speech:</h3>
            <div className={`text-display ${transcript ? 'has-text' : ''}`}>
              {transcript || (isListening ? 'Listening...' : 'Press microphone and speak')}
            </div>
          </div>
        </div>

        <div className="translation-section">
          <div className="translation-header">
            <h3 className="section-label">
              <MdTranslate className="translate-icon" />
              Sign Language Translation:
            </h3>
            {isTranslating && (
              <div className="translating-indicator">
                <FaSpinner className="spinner" />
                Translating...
              </div>
            )}
          </div>

          {translation.length > 0 ? (
            <div className="translation-result">
              <div className="translated-text">{translation.join(' ')}</div>
              {renderSignCards(translation)}
            </div>
          ) : (
            <div className="translation-placeholder">
              {error ? (
                <div className="error-message">{error}</div>
              ) : (
                <div className="placeholder-text">
                  Your translation will appear here
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="translator-footer">
        <p className="footer-note">
          Note: This app uses AssemblyAI for transcription. Ensure your mic is working.
        </p>
      </div>
    </div>
  );
};

export default VoiceTranslator;
