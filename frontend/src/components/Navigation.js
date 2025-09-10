import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            TechXChange
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Products
            </Link>
            <Link
              to="/sellers"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/sellers'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Sellers
            </Link>

            {isAuthenticated ? (
              <>  
              <Link
              to="/add-product"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/add-product'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Add Product
            </Link>  
              <>
                <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/login'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/register'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;