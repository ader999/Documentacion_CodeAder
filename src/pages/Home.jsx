// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentaciones, handleApiError } from "../services/api";

const Home = () => {
  const { user, handleExpiredSession } = useAuth();
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Resetear estados al inicio del efecto
    setError(null);
    setLoading(true);
    
    // Verificar autenticación
    if (!user || !user.accessToken) {
      console.log("No hay usuario autenticado o token válido");
      setError({
        type: "auth",
        message: "Necesitas iniciar sesión para ver los documentos"
      });
      setLoading(false);
      return; // Salir temprano si no hay token
    }

    // Realizar la petición a la API usando el nuevo servicio
    getDocumentaciones()
      .then((res) => {
        // Filtramos para mostrar solo las documentaciones destacadas
        const documentacionesDestacadas = res.data.filter(doc => doc.destacado);
        setDocumentos(documentacionesDestacadas);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar documentaciones:", err);
        
        // Usar la función de manejo de errores global
        const errorInfo = handleApiError(err, handleExpiredSession);
        setError(errorInfo);
        setDocumentos([]);
        setLoading(false);
      });
  }, [user, handleExpiredSession]);

  return (
    <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 pb-20 md:pb-24 lg:pb-32 max-w-[60%] mx-auto">
      <h1 className="text-4xl md:text-5xl font-medium leading-none tracking-tight text-gray-900">
        <span className="block">Últimos</span>
        <span className="block">Documentos</span>
        <span className="block">Subidos</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando documentos...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          {error.type === "auth" ? (
            <>
              <p className="text-red-700 mb-4">{error.message}</p>
              <p className="text-gray-700 mb-4">
                Para ver los documentos, necesitas iniciar sesión con tu cuenta de Google.
              </p>
              <button 
                onClick={() => {
                  // Encuentra el botón de inicio de sesión en el Header y haz clic en él
                  const loginButton = document.querySelector('button[class*="opacity-50"]');
                  if (loginButton) loginButton.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </>
          ) : (
            <p className="text-red-700">{error.message}</p>
          )}
        </div>
      ) : documentos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No hay documentos disponibles actualmente.</p>
        </div>
      ) : (
        <div className="text-base md:text-xl font-medium leading-tight tracking-wide text-gray-600">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Documentaciones Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={doc.portada}
                      alt={`Portada de ${doc.titulo}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.titulo}</h3>
                      {doc.logo && (
                        <img 
                          src={doc.logo} 
                          alt={`Logo de ${doc.titulo}`} 
                          className="h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{doc.descripcion}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {doc.tipo}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {doc.estado}
                      </span>
                    </div>
                    
                    <Link
                      to={`/documentaciones/${doc.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Ver Documentación
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/documentaciones"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ver todas las documentaciones
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
