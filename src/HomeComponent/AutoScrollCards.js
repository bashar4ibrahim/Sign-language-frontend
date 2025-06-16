import React, { useState, useEffect, useRef } from 'react';
import './AutoScrollCards.css';
import backgroundImage from '../Assests/SignSlide.png'; // Replace with your image path

const AutoScrollCards = ({ scrollDirection = "vertical" }) => {
const cards = useState([
  {
    id: 1,
    amount: "5 Stars",
    period: "User Rating",
    title: "Video Lessons",
    subtitle: "Feature",
    user: "Alex Johnson",
    comment: "The sign language video lessons on YourVoice are so clear and engaging! I've learned so much in just a few weeks.",
    avatar: "AJ"
  },
  {
    id: 2,
    amount: "4.8/5",
    period: "User Rating",
    title: "Progress Tracking",
    subtitle: "Feature",
    user: "Sarah Miller",
    comment: "I love how YourVoice tracks my progress and motivates me to keep learning. The interface is super intuitive!",
    avatar: "SM"
  },
  {
    id: 3,
    amount: "5 Stars",
    period: "User Rating",
    title: "Interactive Exercises",
    subtitle: "Feature",
    user: "Michael Chen",
    comment: "The practice exercises are fun and really help reinforce what I learn. YourVoice makes learning sign language a joy!",
    avatar: "MC"
  },
  {
    id: 4,
    amount: "4.9/5",
    period: "User Rating",
    title: "Mobile App",
    subtitle: "Feature",
    user: "Emily Wilson",
    comment: "The YourVoice mobile app is fantastic! I can practice anywhere, and the videos load quickly even on my commute.",
    avatar: "EW"
  },
  {
    id: 5,
    amount: "5 Stars",
    period: "User Rating",
    title: "Community Support",
    subtitle: "Feature",
    user: "David Kim",
    comment: "The YourVoice community is so supportive! Connecting with other learners has made my journey so rewarding.",
    avatar: "DK"
  }
]);

  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    let animationFrameId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        if (scrollDirection === 'vertical') {
          if (scrollPosition >= scrollContainer.scrollHeight / 2) scrollPosition = 0;
          scrollContainer.scrollTop = scrollPosition;
        } else {
          if (scrollPosition >= scrollContainer.scrollWidth / 2) scrollPosition = 0;
          scrollContainer.scrollLeft = scrollPosition;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, scrollDirection]);

  return (
    <div className="combined-container">
      {/* Show left image only if vertical layout */}
      {scrollDirection === "vertical" && (
        <div className="image-container">
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="background-image"
          />
        </div>
      )}

      {/* Multiple rows of horizontally scrolling cards */}
      <div className="vertical-rows">
        {[...Array(1)].map((_, index) => (
          <div className="cards-wrapper" key={index}>
            <div className="cards-overlay">
              <div 
  className={`scrolling-cards-container ${scrollDirection}`} 
  ref={index === 0 ? containerRef : null}
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>

                {cards.map((card) => (
                  <div key={card.id} className="user-card">
                    <div className="user-card-header">
                      <div className="user-avatar">{card.avatar}</div>
                      <div className="user-info">
                        <div className="user-name">{card.user}</div>
                        <div className="follow-button">Follow</div>
                      </div>
                    </div>
                    <div className="user-comment">{card.comment}</div>
                    <div className="user-card-footer">
                      <div className="user-amount">{card.amount}</div>
                      <div className="user-period">{card.period}</div>
                    </div>
                  </div>
                ))}
                {cards.map((card) => (
                  <div key={`duplicate-${card.id}`} className="user-card" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoScrollCards;
