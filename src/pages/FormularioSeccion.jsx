import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createSeccion, getDocumentaciones, handleApiError } from "../services/api";

// Importamos CKEditor para el contenido enriquecido
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const FormularioSeccion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleExpiredSession } = useAuth();
  
  // Obtener documentacionId de los query params si existe
  const queryParams = new URLSearchParams(location.search);
  const documentacionIdParam = queryParams.get('documentacion');
  
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    orden: 1,
    icono: "",
    slug: "",
    documentacion: documentacionIdParam || "",
  });
  
  const [documentaciones, setDocumentaciones] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(true);

  // Cargar lista de documentaciones al iniciar
  useEffect(() => {
    const cargarDocumentaciones = async () => {
      if (!user || !user.accessToken) {
        setMensaje({
          tipo: "error",
          texto: "Necesitas iniciar sesión para crear secciones"
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getDocumentaciones();
        setDocumentaciones(response.data);
        setLoading(false);
      } catch (error) {
        const errorInfo = handleApiError(error, handleExpiredSession);
        setMensaje({
          tipo: "error",
          texto: errorInfo.message
        });
        setLoading(false);
      }
    };

    cargarDocumentaciones();
  }, [user, handleExpiredSession]);

  // Manejar cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Generar slug automáticamente desde el título
  const handleTituloChange = (e) => {
    const titulo = e.target.value;
    setFormData({
      ...formData,
      titulo,
      slug: titulo
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
    });
    
    if (errors.titulo) {
      setErrors({
        ...errors,
        titulo: null
      });
    }
  };

  // Validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = "El título es obligatorio";
    }
    
    if (!formData.documentacion) {
      nuevosErrores.documentacion = "Debes seleccionar una documentación";
    }
    
    if (!formData.slug) {
      nuevosErrores.slug = "El slug es obligatorio";
    }
    
    if (!formData.contenido.trim()) {
      nuevosErrores.contenido = "El contenido es obligatorio";
    }
    
    if (isNaN(formData.orden) || formData.orden < 1) {
      nuevosErrores.orden = "El orden debe ser un número positivo";
    }
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMensaje({
        tipo: "error",
        texto: "Necesitas iniciar sesión para crear secciones"
      });
      return;
    }
    
    if (!validarFormulario()) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, corrige los errores en el formulario"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMensaje({ tipo: "", texto: "" });
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        orden: parseInt(formData.orden, 10)
      };
      
      await createSeccion(dataToSend);
      
      setMensaje({
        tipo: "exito",
        texto: "¡Sección creada con éxito!"
      });
      
      // Redireccionar a la página de detalle de la documentación
      setTimeout(() => {
        navigate(`/documentaciones/${formData.documentacion}`);
      }, 2000);
      
    } catch (error) {
      const errorInfo = handleApiError(error, handleExpiredSession);
      
      setMensaje({
        tipo: "error",
        texto: errorInfo.message
      });
      
      // Si hay errores de validación del servidor, mostrarlos
      if (error.response && error.response.data) {
        const serverErrors = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          serverErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(serverErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Crear Nueva Sección</h1>
      
      {mensaje.texto && (
        <div 
          className={`p-4 rounded-md mb-6 ${
            mensaje.tipo === "error" 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Documentación */}
            <div>
              <label htmlFor="documentacion" className="block text-sm font-medium text-gray-700 mb-1">
                Documentación <span className="text-red-500">*</span>
              </label>
              <select
                id="documentacion"
                name="documentacion"
                value={formData.documentacion}
                onChange={handleInputChange}
                className={`w-full border ${errors.documentacion ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              >
                <option value="">Selecciona una documentación</option>
                {documentaciones.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.titulo}
                  </option>
                ))}
              </select>
              {errors.documentacion && (
                <p className="mt-1 text-sm text-red-600">{errors.documentacion}</p>
              )}
            </div>
            
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleTituloChange}
                className={`w-full border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
              )}
            </div>
            
            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Identificador único para URLs amigables. Se genera automáticamente desde el título.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orden */}
              <div>
                <label htmlFor="orden" className="block text-sm font-medium text-gray-700 mb-1">
                  Orden <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="orden"
                  name="orden"
                  min="1"
                  value={formData.orden}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.orden ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
                />
                {errors.orden && (
                  <p className="mt-1 text-sm text-red-600">{errors.orden}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Posición de la sección en el menú.
                </p>
              </div>
              
              {/* Icono */}
              <div>
                <label htmlFor="icono" className="block text-sm font-medium text-gray-700 mb-1">
                  Icono
                </label>
                <input
                  type="text"
                  id="icono"
                  name="icono"
                  value={formData.icono}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  placeholder="Ej: 📚"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Emoji o símbolo para identificar la sección.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Contenido <span className="text-red-500">*</span></h2>
          
          <div>
            <CKEditor
              editor={ClassicEditor}
              data={formData.contenido}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData({
                  ...formData,
                  contenido: data
                });
                
                if (errors.contenido) {
                  setErrors({
                    ...errors,
                    contenido: null
                  });
                }
              }}
              config={{
                toolbar: [
                  'heading', '|',
                  'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                  'blockQuote', 'insertTable', 'codeBlock', '|',
                  'undo', 'redo'
                ]
              }}
            />
            {errors.contenido && (
              <p className="mt-1 text-sm text-red-600">{errors.contenido}</p>
            )}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/documentaciones')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Sección'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioSeccion;
