import React from "react";
import FeatureSection from "./FeatureSection";
import AutoScrollCards from "./AutoScrollCards";
import './Home.css';
import Slider from './Slider'
import SignFeatures from "./SignFeatures";

import { FaHandsHelping, FaComments, FaMicrophoneAlt, FaHeart } from "react-icons/fa";


const Home = ()=>{


  return(

   
<div>
     <Slider/>
      
       
     
   <SignFeatures/>

    
    <FeatureSection/>
   {/* Vertical usage */}
<AutoScrollCards scrollDirection="vertical" />

<div className="component-showcase">
  <div className="component-grid">
    <div className="component-highlight">
      <FaHandsHelping className="highlight-icon" />
      <h3 className="highlight-number">100+</h3>
      <p className="highlight-text">Sign language gestures to explore and learn</p>
    </div>

    <div className="component-highlight">
      <FaComments className="highlight-icon" />
      <h3 className="highlight-number">30+</h3>
      <p className="highlight-text">Common phrases translated into sign language</p>
    </div>

    <div className="component-highlight">
      <FaMicrophoneAlt className="highlight-icon" />
      <h3 className="highlight-symbol">🎤➡️🤟</h3>
      <p className="highlight-text">Voice-to-sign translation powered by smart technology</p>
    </div>

    <div className="component-highlight">
      <FaHeart className="highlight-icon" />
      <h3 className="highlight-label">FREE</h3>
      <p className="highlight-text">Open for everyone to learn and communicate</p>
    </div>
  </div>

  <div className="showcase-divider"></div>

  <div className="showcase-cta">
    <p>Start learning sign language today and bridge the communication gap</p>
  </div>
</div>


  
       
</div>
  )


}


export default Home;