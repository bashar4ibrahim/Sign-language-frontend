// EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import './EditProfile.css'
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const EditProfile = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    id : '',
    username: '',
    email: '',
    bio: '',
    title: '',
    location: '',
    joined_date: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUserData({
          id : res.data.id,
          username: res.data.username,
          email: res.data.email,
          bio: res.data.bio || '',
          title: res.data.title || '',
          location: res.data.location || '',
          joined_date: res.data.createdAt
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      `${SERVER_URL}/api/users/${userData.id}`, // Make sure you have user.id in state
      {
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        title: userData.title,
        location: userData.location
      },
      { withCredentials: true }
    );
    
    // Optional: Update local state if needed
    navigate('/profile', { state: { updatedUser: response.data } });
  } catch (err) {
    console.error('Failed to update profile:', err);
    alert(err.response?.data?.error || 'Failed to update profile');
  }
};

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="edit-profile-container glassmorphism">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={userData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Joined Date</label>
          <input
            type="text"
            value={new Date(userData.joined_date).toLocaleDateString()}
            disabled
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/profile')}>
            <FiX /> Cancel
          </button>
          <button type="submit" className="save-btn">
            <FiSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;