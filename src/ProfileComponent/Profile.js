import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

import { FiEdit, FiHeart, FiMessageSquare, FiLogOut, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {  FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';

import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [middleImage, setMiddleImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempMiddleImage, setTempMiddleImage] = useState(null);
  const [likes, setLikes] = useState(0);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  // In your Profile.js
const navigateToEditProfile = () => {
  navigate('/EditProfile');
};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${SERVER_URL}/api/auth/me`, {
          withCredentials: true,
        });
        const userData = res.data;
        setUser(userData);
    

        // Add debug logging
        console.log('Raw profile_image from API:', userData.profile_image);
        console.log('Raw middle_image from API:', userData.middle_image);

        // Update image states with proper URLs
        setProfileImage(
          userData.profile_image
            ? `${SERVER_URL}/uploads/${userData.profile_image}`
            : null
        );

        setMiddleImage(
          userData.middle_image
            ? `${SERVER_URL}/uploads/${userData.middle_image}`
            : null
        );
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageType', imageType === 'profile_image' ? 'profile_image' : 'middle_image');

    try {
      const userId = user?.id;
      if (!userId) throw new Error('User ID not available');

      // Set temporary preview
      const tempUrl = URL.createObjectURL(file);
      if (imageType === 'profile_image') {
        setTempProfileImage(tempUrl);
      } else {
        setTempMiddleImage(tempUrl);
      }

      const response = await axios.post(
        `${SERVER_URL}/api/users/${userId}/image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      // Update state
      if (imageType === 'profile_image') {
        setProfileImage(response.data.image);
        setTempProfileImage(null);
      } else {
        setMiddleImage(response.data.image);
        setTempMiddleImage(null);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      if (imageType === 'profile_image') {
        setTempProfileImage(null);
      } else {
        setTempMiddleImage(null);
      }
      alert(err.response?.data?.message || 'Image upload failed');
    }
  };

  const getImageUrl = (img, imageType) => {
    if (!img) return '';

    // Handle temporary preview URLs
    if (img.startsWith('blob:') || img.startsWith('data:')) {
      return img;
    }

    // Handle already full URLs
    if (img.startsWith('http')) {
      return img;
    }

    // New URL format using dedicated endpoints
    return imageType === 'profile'
      ? `${SERVER_URL}/api/users/${user?.id}/profile-image`
      : `${SERVER_URL}/api/users/${user?.id}/middle-image`;
  };


  const handleLike = () => setLikes(likes + 1);

  const handleSignOut = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleFollow = () => setIsFollowing(!isFollowing);

  if (isLoading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error-container">User not found</div>;
  }




  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Three Cards Layout */}
      <div className="cards-grid">
        {/* Profile Info Card (Left) */}
        <div className="profile-card user-info-card glassmorphism">
          <div className="profile-header">
            <div className="profile-image-container">
              {profileImage || tempProfileImage ? (
                <div className="image-edit-overlay">
                  <img
                    src={getImageUrl(tempProfileImage || profileImage, 'profile')}
                    alt="Profile"
                    className="profile-image"
                  />
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile_image')}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-upload" className="edit-icon">
                    <FiEdit />
                  </label>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="avatar-placeholder">
                    <FiUser className="avatar-icon" />
                  </div>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile_image')}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-upload" className="upload-label">
                    <FiEdit className="upload-icon" />
                  </label>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.username}</h1>
              <p className="user-title">{user.title || 'Member'}</p>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-number">{user.followers || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user.following || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              <div className="user-actions">
                <motion.button
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={toggleFollow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
                <motion.button 
                  className="message-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMessageSquare className="btn-icon" />
                  Message
                </motion.button>
              </div>
            </div>
          </div>
          <div className="user-details">
            <div className="detail-item">
              <FiMail className="detail-icon" />
              <span className="detail-value">{user.email}</span>
            </div>
            {user.location && (
              <div className="detail-item">
                <FiMapPin className="detail-icon" />
                <span className="detail-value">{user.location}</span>
              </div>
            )}
            <div className="detail-item">
              <FiCalendar className="detail-icon" />
              <span className="detail-value">
                Joined {new Date(user.joined_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Image Card (Center) */}
        <div className="profile-card middle-card glassmorphism">
          <div className="post-upload">
            {middleImage || tempMiddleImage ? (
              <div className="uploaded-image-container">
                <img
                  src={getImageUrl(tempMiddleImage || middleImage, 'middle')}
                  alt="Post"
                  className="uploaded-image"
                />
                <div className="image-overlay">
                  <input
                    type="file"
                    id="post-upload"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'middle_image')}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="post-upload" className="edit-icon">
                    <FiEdit />
                  </label>
                  <motion.button 
                    className="love-btn" 
                    onClick={handleLike}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiHeart className={`heart-icon ${likes > 0 ? 'active' : ''}`} />
                    <span className="like-count">{likes}</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder post-upload-placeholder">
                <input
                  type="file"
                  id="post-upload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'middle_image')}
                  style={{ display: 'none' }}
                />
                <label htmlFor="post-upload" className="upload-label">
                  <div className="upload-content">
                    <FiEdit className="upload-icon large" />
                    <p>Upload your cover photo</p>
                    <span className="upload-hint">PNG, JPG or GIF up to 10MB</span>
                  </div>
                </label>
              </div>
            )}
          </div>
          <motion.button 
            className="signout-btn glassmorphism" 
            onClick={handleSignOut}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiLogOut className="signout-icon" />
            Sign Out
          </motion.button>
        </div>

        {/* Bio Card (Right) */}
        <div className="profile-card bio-card glassmorphism">
          <div className="bio-section">
            <div className="section-header">
              <h2>About Me</h2>
              <div className="bio-content">
                {user.bio ? (
                  <p>{user.bio}</p>
                ) : (
                  <p className="empty-bio">No bio yet. Tell us about yourself!</p>
                )}
              </div>
            </div>
          </div>
          <div className="edit-profile-section">
            <motion.button 
              className="edit-profile-btn glassmorphism" 
              onClick={navigateToEditProfile}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit className="edit-profile-icon" />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </div>

      {/* Full-width Content Card */}
      <div className="profile-card content-card glassmorphism">
        <h2 className="content-title">Your Content</h2>
        <div className="content-placeholder">
          <p>Your posts and activities will appear here</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;