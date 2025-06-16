import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}/api/users`, {
          withCredentials: true,
          timeout: 10000,
        });
        setUsers(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Unable to connect to the server. Please check if the backend is running.');
        } else {
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate,SERVER_URL]);

  // Delete a user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${SERVER_URL}/api/users/${userId}`, {
        withCredentials: true,
        timeout: 10000,
      });
      setUsers(users.filter((user) => user.id !== userId));
      setError(null);
    } catch (err) {
      console.error('Error deleting user:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card glassmorphism">
        <h1 className="admin-title">Admin Dashboard - Manage Users</h1>

        {error && (
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="no-users">No users found.</div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td>{user.id}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete-btn"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;