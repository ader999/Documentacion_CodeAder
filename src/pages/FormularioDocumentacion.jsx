import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createDocumentacion, handleApiError } from "../services/api";
import { TIPOS_DOCUMENTACION, ESTADOS_DOCUMENTACION } from "../types";

// Importamos CKEditor para el contenido enriquecido
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const FormularioDocumentacion = () => {
  const navigate = useNavigate();
  const { user, handleExpiredSession } = useAuth();
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "framework",
    version: "",
    url_oficial: "",
    repositorio_url: "",
    contenido: "",
    destacado: false,
    estado: "borrador",
    slug: "",
  });
  
  const [archivos, setArchivos] = useState({
    logo: null,
    portada: null,
    archivo_adjunto: null,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!user || !user.accessToken) {
      setMensaje({
        tipo: "error",
        texto: "Necesitas iniciar sesión para crear documentaciones"
      });
    }
  }, [user]);

  // Manejar cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Manejar cambios en los archivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setArchivos({
      ...archivos,
      [name]: files[0]
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
    
    if (formData.descripcion.length < 10) {
      nuevosErrores.descripcion = "La descripción debe tener al menos 10 caracteres";
    }
    
    if (!formData.slug) {
      nuevosErrores.slug = "El slug es obligatorio";
    }
    
    if (!archivos.portada) {
      nuevosErrores.portada = "La imagen de portada es obligatoria";
    }
    
    if (!formData.contenido.trim()) {
      nuevosErrores.contenido = "El contenido es obligatorio";
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
        texto: "Necesitas iniciar sesión para crear documentaciones"
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
      // Crear FormData para envío de archivos
      const formDataToSend = new FormData();
      
      // Agregar campos de texto
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Agregar archivos
      Object.entries(archivos).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });
      
      const response = await createDocumentacion(formDataToSend);
      
      setMensaje({
        tipo: "exito",
        texto: "¡Documentación creada con éxito!"
      });
      
      // Redireccionar a la página de detalle de la documentación creada
      setTimeout(() => {
        navigate(`/documentaciones/${response.data.id}`);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Crear Nueva Documentación</h1>
      
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
            
            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`w-full border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 10 caracteres.
              </p>
            </div>
          </div>
        </div>
        
        {/* Clasificación */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Clasificación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {Object.entries(TIPOS_DOCUMENTACION).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {Object.entries(ESTADOS_DOCUMENTACION).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Versión */}
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                Versión
              </label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="Ej: 1.0.0"
              />
            </div>
            
            {/* Destacado */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="destacado"
                name="destacado"
                checked={formData.destacado}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
                Marcar como destacado
              </label>
            </div>
          </div>
        </div>
        
        {/* Enlaces */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Enlaces</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* URL Oficial */}
            <div>
              <label htmlFor="url_oficial" className="block text-sm font-medium text-gray-700 mb-1">
                URL Oficial
              </label>
              <input
                type="url"
                id="url_oficial"
                name="url_oficial"
                value={formData.url_oficial}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="https://ejemplo.com"
              />
            </div>
            
            {/* URL Repositorio */}
            <div>
              <label htmlFor="repositorio_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL del Repositorio
              </label>
              <input
                type="url"
                id="repositorio_url"
                name="repositorio_url"
                value={formData.repositorio_url}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="https://github.com/ejemplo/repositorio"
              />
            </div>
          </div>
        </div>
        
        {/* Imágenes y Archivos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Imágenes y Archivos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full border ${errors.logo ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.logo && (
                <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Formato recomendado: PNG o SVG, fondo transparente.
              </p>
            </div>
            
            {/* Portada */}
            <div>
              <label htmlFor="portada" className="block text-sm font-medium text-gray-700 mb-1">
                Imagen de Portada <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="portada"
                name="portada"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full border ${errors.portada ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.portada && (
                <p className="mt-1 text-sm text-red-600">{errors.portada}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Imagen que se mostrará como cabecera de la documentación.
              </p>
            </div>
            
            {/* Archivo adjunto */}
            <div className="md:col-span-2">
              <label htmlFor="archivo_adjunto" className="block text-sm font-medium text-gray-700 mb-1">
                Archivo Adjunto
              </label>
              <input
                type="file"
                id="archivo_adjunto"
                name="archivo_adjunto"
                onChange={handleFileChange}
                className={`w-full border ${errors.archivo_adjunto ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3`}
              />
              {errors.archivo_adjunto && (
                <p className="mt-1 text-sm text-red-600">{errors.archivo_adjunto}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Archivo opcional que los usuarios podrán descargar (PDF, ZIP, etc.).
              </p>
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
                  'blockQuote', 'insertTable', '|',
                  'undo', 'redo'
                ]
              }}
            />
            {errors.contenido && (
              <p className="mt-1 text-sm text-red-600">{errors.contenido}</p>
            )}
            <p className="mt-3 text-sm text-gray-500">
              Contenido principal de la documentación. Aquí puedes incluir información general antes de las secciones.
            </p>
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
            {isSubmitting ? 'Guardando...' : 'Guardar Documentación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDocumentacion;
