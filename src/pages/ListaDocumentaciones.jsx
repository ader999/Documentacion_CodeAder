import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentaciones, handleApiError } from "../services/api";
import { TIPOS_DOCUMENTACION, ESTADOS_DOCUMENTACION } from "../types";

const ListaDocumentaciones = () => {
  const { user, handleExpiredSession } = useAuth();
  const [documentaciones, setDocumentaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    tipo: '',
    estado: ''
  });

  useEffect(() => {
    // Resetear estados al inicio del efecto
    setError(null);
    setLoading(true);
    
    // Verificar autenticación
    if (!user || !user.accessToken) {
      setError({
        type: "auth",
        message: "Necesitas iniciar sesión para ver las documentaciones"
      });
      setLoading(false);
      return;
    }

    // Cargar documentaciones
    getDocumentaciones()
      .then((res) => {
        setDocumentaciones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(handleApiError(err, handleExpiredSession));
        setDocumentaciones([]);
        setLoading(false);
      });
  }, [user, handleExpiredSession]);

  // Filtrar documentaciones
  const documentacionesFiltradas = documentaciones.filter(doc => {
    const matchTipo = !filtro.tipo || doc.tipo === filtro.tipo;
    const matchEstado = !filtro.estado || doc.estado === filtro.estado;
    return matchTipo && matchEstado;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documentaciones</h1>
        <Link
          to="/documentaciones/crear"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Nueva Documentación
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-medium mb-3">Filtrar por:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtro.tipo}
              onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(TIPOS_DOCUMENTACION).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filtro.estado}
              onChange={(e) => setFiltro({...filtro, estado: e.target.value})}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="">Todos los estados</option>
              {Object.entries(ESTADOS_DOCUMENTACION).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando documentaciones...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          {error.type === "auth" ? (
            <>
              <p className="text-red-700 mb-4">{error.message}</p>
              <p className="text-gray-700 mb-4">
                Para ver las documentaciones, necesitas iniciar sesión con tu cuenta de Google.
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
      ) : documentacionesFiltradas.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No hay documentaciones disponibles que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentacionesFiltradas.map((doc) => (
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
                  {doc.destacado && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Destacado
                    </span>
                  )}
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
      )}
    </div>
  );
};

export default ListaDocumentaciones;
