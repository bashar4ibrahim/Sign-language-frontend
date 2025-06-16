import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import logo from '../Assests/logo-black.png'; // Using single logo
import search_icon from '../Assests/search-b.png'; // Using single search icon
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa"; // Admin icon

const Navbar = ({ isAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleToolsDropdown = () => {
    setShowToolsDropdown(!showToolsDropdown);
  };

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo"/>
      </Link>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/lessons">Lessons</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/about">About</Link></li>
        
        {/* Tools Dropdown */}
        <li className="nav-dropdown">
          <div 
            className="dropdown-toggle"
            onClick={toggleToolsDropdown}
          >
            Tools
            {showToolsDropdown ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {showToolsDropdown && (
            <div className="dropdown-menu">
              <Link 
                to="/VoiceToSign" 
                className="dropdown-item"
                onClick={() => setShowToolsDropdown(false)}
              >
                Voice To Sign
              </Link>
              <Link 
                to="/EmergencyPhrases" 
                className="dropdown-item"
                onClick={() => setShowToolsDropdown(false)}
              >
                Emergency Phrases
              </Link>
            </div>
          )}
        </li>

        {/* Admin Panel Link - Only visible to admins */}
        {isAdmin && (
          <li className="admin-nav-item">
            <Link to="/Admin" className="admin-link">
              <FaUserShield className="admin-icon" />
              Admin Panel
            </Link>
          </li>
        )}
      </ul>
      
      <div className="search-box">
        <input type="text" placeholder="Search"/>
        <img src={search_icon} alt="Search"/>
      </div>
    </div>
  );
};

export default Navbar;