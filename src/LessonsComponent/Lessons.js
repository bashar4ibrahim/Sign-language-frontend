import React, { useState, useEffect } from "react";
import "./Lessons.css";
import axios from "axios";
import Slider from "../HomeComponent/Slider";
import VideoList from "../videoListComponent/videoList";
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const Lessons = () => {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressUpdating, setProgressUpdating] = useState(false);
  const [userId, setUserId] = useState(null);
 
  // Fetch user ID and decide data source (localStorage or backend)
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        const userRes = await axios.get(`${SERVER_URL}/api/auth/me`, {
          withCredentials: true,
        });
        const uid = userRes.data.id;
        setUserId(uid);

        const progressRes = await axios.get(`${SERVER_URL}/api/users/${uid}/progress`, {
          withCredentials: true,
        });

        const backendProgress = progressRes.data || {};

        // Clear localStorage if backend progress is empty (first time user)
        if (Object.keys(backendProgress).length === 0) {
          Object.keys(localStorage)
            .filter((key) => key.startsWith("video_") && key.endsWith("_completed"))
            .forEach((key) => localStorage.removeItem(key));

          localStorage.setItem("lessonProgress", "{}");
        } else {
          // Mark completed videos in localStorage for consistency
          Object.entries(backendProgress).forEach(([categoryId, videoIds]) => {
            videoIds.forEach((videoId) => {
              localStorage.setItem(`video_${videoId}_completed`, "true");
            });
            backendProgress[categoryId] = videoIds.length;
          });
        }

        setProgress(backendProgress);
      } catch (err) {
        console.log("Guest mode. Loading progress from localStorage...");
        const savedProgress = JSON.parse(localStorage.getItem("lessonProgress")) || {};
        setProgress(savedProgress);
      }
    };

    initializeProgress();
  }, []);

  // Fetch categories and their videos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URL}/api/categories`);
        const categoriesData = response.data;

        const progressData = {};
        for (const category of categoriesData) {
          const videoRes = await axios.get(
            `${SERVER_URL}/api/categories/${category.id}/videos`
          );
          const videos = videoRes.data || [];

          const completedCount = videos.filter(
            (video) => localStorage.getItem(`video_${video.id}_completed`) === "true"
          ).length;

          category.videos = videos;
          category.video_count = videos.length;
          progressData[category.id] = completedCount;
        }

        setCategories(categoriesData);
        setProgress((prev) => ({ ...prev, ...progressData }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Save progress to localStorage (for guests)
  useEffect(() => {
    if (!userId) {
      localStorage.setItem("lessonProgress", JSON.stringify(progress));
    }
  }, [progress, userId]);

 const completeVideo = async (videoId) => {
 
  // Always use selectedCategory (because categories don't have videos populated)
  const category = selectedCategory;
  if (!category) {
    console.error("No selected category");
    return;
  }

  const categoryId = category.id;
  const currentProgress = progress[categoryId] || 0;
  const totalVideos = category.videos?.length || category.video_count || 1;

  if (currentProgress >= totalVideos) return;

  try {
    console.log("Submitting progress for", videoId);

    if (userId) {
      await axios.post(
        `${SERVER_URL}/api/users/${userId}/progress/${videoId}`,
        {},
        { withCredentials: true }
      );
    }

    localStorage.setItem(`video_${videoId}_completed`, "true");

    setProgressUpdating(true);
    setProgress((prev) => ({
      ...prev,
      [categoryId]: currentProgress + 1,
    }));
    setTimeout(() => setProgressUpdating(false), 500);
  } catch (error) {
    console.error("Failed to update video progress:", error);
    alert("Error updating progress. Please try again.");
  }
};


  const handleSelectCategory = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/api/categories/${category.id}/videos`);
      const videos = response.data || [];
      setSelectedCategory({
        ...category,
        videos: videos,
        video_count: videos.length,
      });
    } catch (err) {
      console.error("Error loading videos:", err);
      setSelectedCategory(category);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  if (loading && !selectedCategory) {
    return (
      <section className="lessons-section">
        <Slider />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading lessons...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Slider />
      <section className="lessons-section">
        {selectedCategory ? (
          <div className="video-list-container">
            <div className="category-header">
              <button className="back-button" onClick={handleBackToCategories}>
                ← Back to Categories
              </button>
              <h2 className="lessons-title">{selectedCategory.title} Videos</h2>
              <div className="category-progress">
                <span>
                  Progress:{" "}
                  {Math.round(
                    ((progress[selectedCategory.id] || 0) /
                      (selectedCategory.video_count || 1)) * 100
                  )}
                  %
                </span>
                <span>
                  {progress[selectedCategory.id] || 0}/{selectedCategory.video_count} videos
                </span>
              </div>
            </div>
            <VideoList
              categoryId={selectedCategory.id}
              onVideoCompleted={completeVideo}
              videos={selectedCategory.videos}
            />
          </div>
        ) : (
          <>
            <h2 className="lessons-title">Explore Sign Language Lessons</h2>
            <div className="lessons-grid">
              {categories.map((category) => {
                const completed = progress[category.id] || 0;
                const totalVideos = category.video_count || 1;
                const percentage =
                  totalVideos > 0 ? Math.round((completed / totalVideos) * 100) : 0;

                return (
                  <div className="lesson-card" key={category.id}>
                    <div className="card-image-container">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.title}
                          className="lesson-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-lesson-image.jpg";
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          <span>No Image Available</span>
                        </div>
                      )}
                      <div className="difficulty-badge">{category.level}</div>
                    </div>
                    <div className="lesson-content">
                      <h3 className="lesson-heading">{category.title}</h3>
                      <p className="lesson-description">{category.description}</p>
                      <div className="progress-container">
                        <div className="progress-info">
                          <span>Progress: {percentage}%</span>
                          <span>
                            {completed}/{totalVideos} videos
                          </span>
                        </div>
                        <div className={`progress-bar ${progressUpdating ? "progress-updating" : ""}`}>
                          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                      <button
                        className="start-lesson-button"
                        onClick={() => handleSelectCategory(category)}
                      >
                        Start Lesson
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Lessons;
