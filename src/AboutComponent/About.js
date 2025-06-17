import React from "react";
import { motion } from "framer-motion";
import "./About.css";
const Timeline = () => {
 const milestones = [
  {
    year: "2022",
    title: "Inspiration Sparked",
    description: "The idea was born to bridge the communication gap between the deaf community and society through accessible technology.",
    icon: "💡"
  },
  {
    year: "2023",
    title: "Prototype Glove Built",
    description: "Developed an IoT-powered glove that translates sign language into speech, marking our first step toward accessibility.",
    icon: "🧤"
  },
  {
    year: "2023",
    title: "Your Voice Platform Started",
    description: "Launched the initial version of the Your Voice web platform focused on translating voice to signs using AI.",
    icon: "🗣️"
  },
  {
    year: "2024",
    title: "Web App Goes Public",
    description: "Released our full-stack web application featuring lessons, emergency phrases, and real-time voice translation.",
    icon: "🌐"
  },
  {
    year: "2024",
    title: "Community Engagement",
    description: "Partnered with local organizations and deaf users to improve content, usability, and accessibility features.",
    icon: "🤝"
  },
  {
    year: "2025",
    title: "AI-Powered Expansion",
    description: "Integrating advanced voice recognition APIs and AI models to enhance real-time communication accuracy.",
    icon: "🤖"
  }
];


  return (
    <div className="timeline-container">
      <h2 className="timeline-title">Our Journey</h2>
      <p className="timeline-subtitle">Milestones that shaped our story</p>
      
      <div className="timeline">
        {milestones.map((item, index) => (
          <motion.div 
            key={index}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="timeline-content">
              <div className="timeline-icon">{item.icon}</div>
              <div className="timeline-year">{item.year}</div>
              <h3 className="timeline-item-title">{item.title}</h3>
              <p className="timeline-item-description">{item.description}</p>
              <div className="timeline-connector"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;