import React from "react";
import { motion } from "framer-motion";
import "./About.css";
const Timeline = () => {
  const milestones = [
    {
      year: "2015",
      title: "Company Founded",
      description: "Started in a small garage with just 3 team members and a big vision for digital design.",
      icon: "🚀"
    },
    {
      year: "2017",
      title: "First Major Client",
      description: "Landed our first Fortune 500 client, marking our entry into enterprise solutions.",
      icon: "🏆"
    },
    {
      year: "2019",
      title: "Expanded Globally",
      description: "Opened offices in London and Tokyo to serve international clients.",
      icon: "🌎"
    },
    {
      year: "2021",
      title: "Product Suite Launched",
      description: "Introduced our flagship product line that revolutionized workflow automation.",
      icon: "✨"
    },
    {
      year: "2023",
      title: "1000+ Clients",
      description: "Reached the milestone of serving over 1000 satisfied clients worldwide.",
      icon: "🎯"
    },
    {
      year: "2024",
      title: "Future Horizons",
      description: "Expanding into AI-powered design solutions and sustainable tech.",
      icon: "🔮"
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