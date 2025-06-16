import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const containerRef = useRef(null);
  let animationInstance = useRef(null);

  useEffect(() => {
    animationInstance.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json',
    });

    return () => {
      // Clean up animation on unmount to prevent duplicate rendering
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="error-container container d-flex flex-column justify-content-center align-items-center">
      <div className="lottie-animation" ref={containerRef}></div>
      <div className="error-content text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-4">Really! What You are doing here?</p>
        <Link to="/" className="btn btn-primary">
          Back Home 
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
