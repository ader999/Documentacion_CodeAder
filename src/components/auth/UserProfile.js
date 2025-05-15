import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <img 
        src={user.picture} 
        alt={user.name} 
        className="w-8 h-8 rounded-full"
      />
      <div className="text-sm">
        <div className="font-medium text-gray-900">{user.name}</div>
        <button 
          onClick={logout}
          className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
