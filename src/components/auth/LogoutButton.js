import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
