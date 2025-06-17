import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Your Voice - صوتك</h2>
          <p className="footer-description">
            Bridging communication gaps and empowering the deaf community through innovative and inclusive technology.
          </p>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h3 className="links-title">Navigation</h3>
            <ul className="links-list">
              <li><a href="/about">About the Project</a></li>
              <li><a href="/lessons">Lessons</a></li>
              <li><a href="/translate">Translator</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3 className="links-title">Help & Info</h3>
            <ul className="links-list">
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/support">User Support</a></li>
              <li><a href="/emergency">Emergency Phrases</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3 className="links-title">Join Our Mission</h3>
            <p className="newsletter-text">Get updates on new features and accessibility tools.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="email-input" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © 2024 Your Voice. All rights reserved.
        </div>
        <div className="legal-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
