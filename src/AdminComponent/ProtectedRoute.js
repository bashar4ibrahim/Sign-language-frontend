// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  if (!isAdmin) {
    // Redirect to home or login page if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;