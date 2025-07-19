// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, allowed, children }) => {
  if (!allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
