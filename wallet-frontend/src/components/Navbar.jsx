import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-xl font-bold hover:text-gray-200 transition-colors">
              💳 Digital Wallet
            </Link>
          </div>
          
          {user && (
            <>
              <div className="hidden lg:flex space-x-4">
                <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">Dashboard</Link>
                <Link to="/add-money" className="px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">Add Money</Link>
                <Link to="/transfer" className="px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">Transfer</Link>
                <Link to="/transactions" className="px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">History</Link>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative lg:hidden">
                  <button className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
                    <div className="bg-purple-800 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-50 hidden group-hover:block">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
