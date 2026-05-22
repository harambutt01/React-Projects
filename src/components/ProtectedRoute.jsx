import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const role = localStorage.getItem("userRole");

  // Check: Kya user admin hai?
  if (role !== "admin") {
    // Agar admin nahi hai, to Home par bhej do
    return <Navigate to="/" replace />;
  }

  // Agar admin hai, to Admin Panel khol do
  return children;
};

export default ProtectedRoute;