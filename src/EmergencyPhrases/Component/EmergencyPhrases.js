import React, { useState, useEffect , useRef} from 'react';
import { FaPlay, FaStop, FaPlus, FaTrash, FaVolumeUp } from 'react-icons/fa';
import './EmergencyPhrases.css';
 const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const EmergencyPhrases = () => {
  const [phrases, setPhrases] = useState(() => {
    const saved = localStorage.getItem('emergencyPhrases');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPhrase, setNewPhrase] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [voice, setVoice] = useState(null);
  const synthRef = useRef(null);
const [userId, setUserId] = useState(null);


const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/auth/me`, {
      credentials: 'include', // Important for session cookies
    });
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    const user = await res.json();
    setUserId(user.id); // Save user ID to state
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
};
useEffect(() => {
  fetchCurrentUser();
}, []);


  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      // Prefer a natural-sounding English voice
      const preferredVoice = voices.find(v => 
        v.lang.includes('en') && v.name.includes('Natural')
      ) || voices.find(v => v.lang.includes('en'));
      
      if (preferredVoice) setVoice(preferredVoice);
    };
    
    // Chrome loads voices asynchronously
    synthRef.current.onvoiceschanged = loadVoices;
    loadVoices();
    
    return () => {
      synthRef.current.onvoiceschanged = null;
    };
  }, []);

  
   useEffect(() => {
  if (!userId) return;

  const fetchPhrases = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/phrases/${userId}`);
      const data = await res.json();
      setPhrases(data);
    } catch (err) {
      console.error('Failed to fetch phrases:', err);
    }
  };

  fetchPhrases();
}, [userId]);


const addPhrase = async () => {
  if (newPhrase.trim() === '' || !userId) return;

  try {
    const res = await fetch(`${SERVER_URL}api/phrases/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newPhrase.trim() }),
    });

    if (!res.ok) throw new Error('Failed to add phrase');

    const added = await res.json();
    setPhrases(prev => [added, ...prev]);
    setNewPhrase('');
  } catch (err) {
    console.error(err);
  }
};

  const deletePhrase = async (id) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/phrases/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPhrases(prev => prev.filter(p => p.id !== id));
    } else {
      throw new Error('Failed to delete');
    }
  } catch (err) {
    console.error(err);
  }
};


  const speakPhrase = (id, text) => {
    if (isSpeaking) {
      synthRef.current.cancel();
      if (currentSpeakingId === id) {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        return;
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 0.9; // Slightly slower than normal
    utterance.pitch = 1; // Normal pitch
    utterance.volume = 1; // Full volume
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(id);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };
    
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };
    
    synthRef.current.speak(utterance);
  };

  return (
    <div className="emergency-container">
      <div className="emergency-header">
        <h2 className="emergency-title">
          <FaVolumeUp className="title-icon" />
          Emergency Phrases
        </h2>
        <p className="emergency-subtitle">
          Save important phrases that can be spoken aloud when needed
        </p>
      </div>

      <div className="phrase-creator">
        <div className="input-group">
          <textarea
            className="phrase-input"
            placeholder="Type an emergency phrase (e.g., 'I need medical help')"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            rows="3"
          />
          <button 
            className="add-button"
            onClick={addPhrase}
            disabled={!newPhrase.trim()}
          >
            <FaPlus className="button-icon" />
            Add Phrase
          </button>
        </div>
      </div>

      <div className="phrases-list">
        {phrases.length === 0 ? (
          <div className="empty-state">
            <p>No emergency phrases saved yet.</p>
            <p>Add your first phrase above.</p>
          </div>
        ) : (
          phrases.map((phrase) => (
            <div key={phrase.id} className="phrase-card">
              <div className="phrase-content">
                <p className="phrase-text">{phrase.text}</p>
                <p className="phrase-date">Added: {phrase.created_at}</p>
              </div>
              <div className="phrase-actions">
                <button
                  className={`play-button ${currentSpeakingId === phrase.id ? 'active' : ''}`}
                  onClick={() => speakPhrase(phrase.id, phrase.text)}
                >
                  {currentSpeakingId === phrase.id ? (
                    <>
                      <FaStop className="button-icon" />
                      Stop
                    </>
                  ) : (
                    <>
                      <FaPlay className="button-icon" />
                      Play
                    </>
                  )}
                </button>
                <button
                  className="delete-button"
                  onClick={() => deletePhrase(phrase.id)}
                >
                  <FaTrash className="button-icon" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="emergency-footer">
        <p className="footer-note">
          These phrases will be saved in your browser and available offline.
        </p>
      </div>
    </div>
  );
};

export default EmergencyPhrases;