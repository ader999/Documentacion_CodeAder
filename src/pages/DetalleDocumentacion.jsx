import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentacion, getSeccionesByDocumentacion, handleApiError } from "../services/api";

const DetalleDocumentacion = () => {
  const { id } = useParams();
  const { user, handleExpiredSession } = useAuth();
  const [documentacion, setDocumentacion] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!user || !user.accessToken) {
      setError({
        type: "auth",
        message: "Necesitas iniciar sesión para ver esta documentación"
      });
      setLoading(false);
      return;
    }

    // Cargar documentación
    const fetchData = async () => {
      try {
        const docResponse = await getDocumentacion(id);
        setDocumentacion(docResponse.data);
        
        const seccionesResponse = await getSeccionesByDocumentacion(id);
        
        // Ordenar secciones por el campo "orden"
        const seccionesOrdenadas = seccionesResponse.data.sort((a, b) => a.orden - b.orden);
        setSecciones(seccionesOrdenadas);
        
        // Seleccionar la primera sección como activa
        if (seccionesOrdenadas.length > 0) {
          setSeccionActiva(seccionesOrdenadas[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(handleApiError(err, handleExpiredSession));
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, handleExpiredSession]);

  // Función para cambiar la sección activa
  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    // Opcional: Scroll hacia arriba para ver el contenido
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando documentación...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          {error.type === "auth" ? (
            <>
              <p className="text-red-700 mb-4">{error.message}</p>
              <p className="text-gray-700 mb-4">
                Para ver esta documentación, necesitas iniciar sesión con tu cuenta de Google.
              </p>
              <button 
                onClick={() => {
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
      </div>
    );
  }

  if (!documentacion) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <p className="text-gray-600">No se encontró la documentación solicitada.</p>
          <Link 
            to="/documentaciones"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver a documentaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera */}
      <div className="relative mb-8">
        <div className="h-64 w-full overflow-hidden rounded-lg">
          <img 
            src={documentacion.portada} 
            alt={`Portada de ${documentacion.titulo}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <div className="flex items-center gap-4 mb-2">
              {documentacion.logo && (
                <img 
                  src={documentacion.logo} 
                  alt={`Logo de ${documentacion.titulo}`}
                  className="h-12 w-12 object-contain bg-white p-1 rounded-md"
                />
              )}
              <h1 className="text-3xl font-bold">{documentacion.titulo}</h1>
            </div>
            <p className="text-lg">{documentacion.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Enlaces y metadatos */}
      <div className="flex flex-wrap gap-4 mb-8">
        {documentacion.url_oficial && (
          <a 
            href={documentacion.url_oficial} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <span>Sitio Oficial</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        
        {documentacion.repositorio_url && (
          <a 
            href={documentacion.repositorio_url} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <span>Repositorio</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        
        {documentacion.archivo_adjunto && (
          <a 
            href={documentacion.archivo_adjunto} 
            download
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <span>Descargar adjunto</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navegación de secciones */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Secciones</h2>
            
            <nav className="flex flex-col space-y-1">
              {secciones.length > 0 ? (
                secciones.map((seccion) => (
                  <button
                    key={seccion.id}
                    onClick={() => cambiarSeccion(seccion)}
                    className={`text-left px-4 py-2 rounded-md flex items-center ${
                      seccionActiva?.id === seccion.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {seccion.icono && (
                      <span className="mr-2">{seccion.icono}</span>
                    )}
                    <span>{seccion.titulo}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 italic">No hay secciones disponibles</p>
              )}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          {/* Información general */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Información General</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: documentacion.contenido }}
            />
          </div>

          {/* Sección activa */}
          {seccionActiva && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{seccionActiva.titulo}</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: seccionActiva.contenido }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Metadatos adicionales */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <p>Versión: {documentacion.version || 'N/A'}</p>
          <p>Tipo: {documentacion.tipo}</p>
          <p>Estado: {documentacion.estado}</p>
          <p>Actualización: {new Date(documentacion.fecha_actualizacion).toLocaleDateString()}</p>
          <p>Autor: {documentacion.autor.username}</p>
        </div>
      </div>
    </div>
  );
};

export default DetalleDocumentacion;
