import React, { useState, useEffect } from 'react';
import './videoList.css';
import PropTypes from 'prop-types';
 const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const VideoList = ({ categoryId, onVideoCompleted, videos = [] }) => {
  const [localVideos, setLocalVideos] = useState(videos);
  const [loading, setLoading] = useState(videos.length === 0);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${SERVER_URL}/api/categories/${categoryId}/videos`
        );
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        setLocalVideos(data);
        syncCompletedVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const syncCompletedVideos = (videoList) => {
      const initialCompleted = {};
      videoList.forEach(video => {
        initialCompleted[video.id] = 
          localStorage.getItem(`video_${video.id}_completed`) === 'true';
      });
      setCompletedVideos(initialCompleted);
    };

    if (videos.length === 0) {
      fetchVideos();
    } else {
      syncCompletedVideos(videos);
    }
  }, [categoryId, videos]);

  const handleVideoSelect = (videoId) => {
    setActiveVideo(videoId === activeVideo ? null : videoId);
  };

  const handleCompleteVideo = (videoId) => {
    if (completedVideos[videoId]) return;

    setCompletedVideos(prev => ({
      ...prev,
      [videoId]: true
    }));
    
    localStorage.setItem(`video_${videoId}_completed`, 'true');
    
    if (onVideoCompleted) onVideoCompleted(videoId);
  };

  if (loading) return (
    <div className="video-list-loading">
      <div className="spinner"></div>
      <p>Loading videos...</p>
    </div>
  );

  if (error) return (
    <div className="video-list-error">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  const videosToDisplay = localVideos.length > 0 ? localVideos : videos;

  return (
    <div className="video-list-container">
      <div className="video-grid">
        {videosToDisplay.map((video) => (
          <div 
            key={video.id}
            className={`video-card ${activeVideo === video.id ? 'active' : ''}`}
            onClick={() => handleVideoSelect(video.id)}
          >
            <div className="video-thumbnail">
              <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                className="thumbnail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-video-thumbnail.jpg';
                }}
              />
              <div className="play-overlay">
                <div className="play-icon">
                  {activeVideo === video.id ? '❚❚' : '▶'}
                </div>
              </div>
              <div className="duration-badge">
                {video.duration}
              </div>
              
              {completedVideos[video.id] && (
                <div className="completed-badge">
                  ✓ Completed
                </div>
              )}
            </div>
            
            <div className="video-details">
              <div className="video-header">
                <h3 className="video-title">
                  {video.video_index || video.id}. {video.title}
                  {completedVideos[video.id] && (
                    <span className="completed-icon"> ✓</span>
                  )}
                </h3>
              </div>
              <p className="video-description">{video.description}</p>
              
              <div className="video-meta">
                <span className={`difficulty-tag ${video.difficulty}`}>
                  {video.difficulty}
                </span>
              </div>
            </div>
            
            {activeVideo === video.id && (
              <div className="video-actions">
                {!completedVideos[video.id] ? (
                  <button 
                    className="action-button complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteVideo(video.id);
                    }}
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <button className="action-button completed" disabled>
                    Completed
                  </button>
                )}
                <button className="action-button practice">
                  Practice Exercise
                </button>
                
                <a 
                  href={video.video_url} 
                  className="watch-button"
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  Watch Video
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

VideoList.propTypes = {
  categoryId: PropTypes.string.isRequired,
  onVideoCompleted: PropTypes.func.isRequired,
  videos: PropTypes.array
};

export default VideoList;