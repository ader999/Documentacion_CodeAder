import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from './GoogleLogin';
import UserProfile from './UserProfile';

const AuthModal = () => {
  const { user, sessionExpired, setSessionExpired, showAuthModal, toggleAuthModal } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Resetear el estado de sesión expirada al desmontar el componente
  useEffect(() => {
    return () => {
      if (sessionExpired) {
        setSessionExpired(false);
      }
    };
  }, [sessionExpired, setSessionExpired]);

  const handleLoginSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      toggleAuthModal();
    }, 2000);
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user ? 'Perfil de Usuario' : 'Iniciar Sesión'}
          </h2>
          <button
            onClick={toggleAuthModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="py-4">
          {showSuccessMessage ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ¡Sesión iniciada correctamente!
            </div>
          ) : user ? (
            <div className="flex flex-col items-center">
              <UserProfile />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {sessionExpired ? (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-center">
                  <p className="text-yellow-700 font-medium">Tu sesión ha expirado</p>
                  <p className="text-gray-600 text-sm mt-1">Por favor, inicia sesión nuevamente para continuar</p>
                </div>
              ) : (
                <p className="mb-4 text-center text-gray-600">
                  Inicia sesión con tu cuenta de Google para acceder a todas las funcionalidades.
                </p>
              )}
              <GoogleLoginButton onSuccess={handleLoginSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
