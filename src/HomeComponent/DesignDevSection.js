import React from 'react';
import './DesignDevSection.css';

const DesignDevSection = () => {
  return (
    <section className="design-dev-section">
      <div className="container">
        <h2 className="section-title">A combination of tools to design and develop modern applications at ease.</h2>
        
        <div className="tools-grid">
          {/* Design Card */}
          <div className="tool-card design-card">
            <h3>Design</h3>
            <p>Design your website by using<br />Atomize for Sketch App.</p>
            <div className="resource-link">
              <a href="#">Design Resource</a>
              <div className="divider"></div>
            </div>
          </div>
          
          {/* Development Card */}
          <div className="tool-card dev-card">
            <h3>Development</h3>
            <p>Bring your designs to life with<br />Atomize for React JS.</p>
            <div className="resource-link">
              <a href="#">Documentation</a>
              <div className="divider"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignDevSection;