import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token from Google
      const decodedUser = jwtDecode(credentialResponse.credential);
      
      // Enviar el token al backend de Django
      try {
        const response = await axios.post('https://apicodeaderdocumentacion-production.up.railway.app/auth/google-login/', {
          credential: credentialResponse.credential
        });
        
        // Obtener la respuesta del backend
        const { user, access, refresh } = response.data;
        
        // Crear objeto con los datos del usuario y tokens JWT
        const userData = {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email,
          picture: user.picture,
          username: user.username,
          accessToken: access,
          refreshToken: refresh
        };
        
        // Guardar usuario en el contexto
        login(userData);
        
        // Llamar al callback onSuccess si se proporciona
        if (onSuccess) {
          onSuccess(userData);
        }
      } catch (backendError) {
        console.error('Error al autenticar con el backend:', backendError);
        
        // Si falla la autenticación con el backend, usamos los datos de Google (solo frontend)
        // Esto es un fallback en caso de que el backend no esté disponible
        const userData = {
          id: decodedUser.sub,
          name: decodedUser.name,
          email: decodedUser.email,
          picture: decodedUser.picture,
          accessToken: credentialResponse.credential,
        };
        
        login(userData);
        
        if (onSuccess) {
          onSuccess(userData);
        }
      }
    } catch (error) {
      console.error('Error al procesar token de Google:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleError = (error) => {
    console.error('Google login error:', error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-2 px-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Conectando...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          text="signin_with"
          shape="rectangular"
          logo_alignment="center"
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;
