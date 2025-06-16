import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureSection.css';
import {
  FaHandsHelping,
  FaMicrophoneAlt,
  FaVideo,
  FaMobileAlt,
  FaPuzzlePiece,
  FaUnlockAlt,
} from 'react-icons/fa';

const FeatureSection = () => {
    const navigate = useNavigate();
  return (
    <div className="feature-section">
     
      <div className="circle-container">
        <div className="circle outer" />
        <div className="circle mid" />
        <div className="circle small" />
        <div className="circle inner" />

        <img
          src="https://cdn.worldvectorlogo.com/logos/react-2.svg"
          alt="React Logo"
          className="react-logo"
        />
     <button 
  className="signup-btn"
  onClick={() => navigate('/AuthSystem')} // Add this onClick handler
>
  Sign Up
</button>
        <div className="toggle-switch"> </div>  
        <div className="check-icon">✓</div>
        <div className="plus-icon">+</div>
      </div>

     
     <div className="text-content">
  <h1>
    Empowering Communication with <span className="highlight-blue"><br />Sign Language </span>  using <span className="highlight-cyan">Smart Technology</span>.
  </h1>

  <div className="feature-grid">
  <div>
    <p className="title"><FaHandsHelping className="feature-icon" /> Learn Signs</p>
    <p>Interactive lessons to explore letters, <br /> words, and common phrases in sign language.</p>
  </div>
  <div>
    <p className="title"><FaMicrophoneAlt className="feature-icon" /> Voice to Sign</p>
    <p>Real-time translation from spoken words <br /> to sign gestures for easy communication.</p>
  </div>
  <div>
    <p className="title"><FaVideo className="feature-icon" /> Visual Learning</p>
    <p>Sign images and video clips <br /> to support visual understanding and memory.</p>
  </div>
  <div>
    <p className="title"><FaMobileAlt className="feature-icon" /> Accessible</p>
    <p>Fully responsive platform that works <br /> on mobile, tablet, and desktop.</p>
  </div>
  <div>
    <p className="title"><FaPuzzlePiece className="feature-icon" /> Personalized</p>
    <p>Track your progress and learn at your <br /> own pace with tailored lessons.</p>
  </div>
  <div>
    <p className="title"><FaUnlockAlt className="feature-icon" /> Free & Open</p>
    <p>Free to use for everyone—breaking <br /> barriers to communication and learning.</p>
  </div>
</div>
</div>

    </div>
  );
};

export default FeatureSection;
