import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userEmail = localStorage.getItem("userEmail");

  // Redirect if not logged in
  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }
  // If adminOnly route, but user is not the admin
  if (adminOnly && userEmail !== "arnav@gmail.com") {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return children;
};

export default ProtectedRoute;
