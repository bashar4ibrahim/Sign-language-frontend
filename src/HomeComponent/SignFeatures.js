import React from "react";
import { Typewriter } from 'react-simple-typewriter';
import { FaHands, FaCommentDots, FaLaptop, FaUniversalAccess } from "react-icons/fa";
import { motion } from "framer-motion";
import "./SignFeatures.css";

const SignFeatures = () => {
  const features = [
    {
      title: "Accessibility",
      description: "Bridging communication for deaf users.",
      icon: <FaUniversalAccess />,
      cardClass: "feature-card-accessibility"
    },
    {
      title: "Real-Time Translation",
      description: "Convert voice to sign instantly.",
      icon: <FaCommentDots />,
      cardClass: "feature-card-translation"
    },
    {
      title: "User-Friendly UI",
      description: "Simple and intuitive interaction design.",
      icon: <FaLaptop />,
      cardClass: "feature-card-ui"
    },
    {
      title: "Gesture Recognition",
      description: "Understand and translate hand gestures.",
      icon: <FaHands />,
      cardClass: "feature-card-gesture"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="features-container">
      <div className="features-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="features-title"
        >
          Why Use Our Sign Language Platform?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="features-subtitle"
        >
          Empowering communication with smart, responsive features.
        </motion.p>
      </div>

      <motion.div 
        className="card-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {features.map((feature, idx) => (
          <motion.div 
            className={`feature-card ${feature.cardClass}`}
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -10 }}
          >
            <div className="icon-container">
              <div className="icon">{feature.icon}</div>
            </div>
            <h3 className="title">
              <Typewriter
                words={[feature.title]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={120}
                deleteSpeed={0}
                delaySpeed={1000}
              />
            </h3>
            <p className="description">{feature.description}</p>
            <a href="#" className="see-how">
              See How →
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SignFeatures;