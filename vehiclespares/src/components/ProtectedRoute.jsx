import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);

  const isAdmin = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.userRole === 'admin';
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  };

  if (!token || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;