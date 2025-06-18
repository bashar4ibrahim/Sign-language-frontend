import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBarComponent/Navbar';
import Home from './HomeComponent/Home';
import Profile from './ProfileComponent/Profile';
import Lessons from './LessonsComponent/Lessons';
import NotFound from './Assests/Components/NotFound';
import Footer from './FooterComponent/Footer';
import About from './AboutComponent/About';
import VoiceTranslator from './VoiceTranslator/component/VoiceTranslator';
import EmergencyPhrases from './EmergencyPhrases/Component/EmergencyPhrases';
import AuthSystem from './AuthSystem/component/AuthSystem';
import VideoList from './videoListComponent/videoList';
import Admin from './AdminComponent/Admin';
import ProtectedRoute from './AdminComponent/ProtectedRoute';
import EditProfile from './editprofileComponent/EditProfile';

function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin status when component mounts
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const user = await response.json();
          setIsAdmin(user.is_admin === true); // Using your is_admin field
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className={`app-root ${theme}`}>
        <Navbar theme={theme} setTheme={setTheme} isAdmin={isAdmin} />
        
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/VoiceToSign" element={<VoiceTranslator />} />
            <Route path="/EmergencyPhrases" element={<EmergencyPhrases />} />
            <Route path="/AuthSystem" element={<AuthSystem />} />
            <Route path="/videoList" element={<VideoList />} />
              <Route path="/EditProfile" element={<EditProfile />} />
            
            <Route
              path="/Admin"
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;