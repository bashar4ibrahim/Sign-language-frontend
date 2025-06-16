import React from "react";
import "./Footer.css"; // We'll create this CSS file next

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">FlowSpace</h2>
          <p className="footer-description">
            Creating beautiful digital experiences with modern design solutions for forward-thinking companies.
          </p>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h3 className="links-title">Quick Links</h3>
            <ul className="links-list">
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3 className="links-title">Resources</h3>
            <ul className="links-list">
              <li><a href="/blog">Blog</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3 className="links-title">Newsletter</h3>
            <p className="newsletter-text">Stay updated with our latest news and updates.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="email-input" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © 2024 FlowSpace. All rights reserved.
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