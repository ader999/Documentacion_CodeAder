import React, { useState, useEffect } from "react"; // Importa useEffect
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CrearDocumento = () => {
  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [portada, setPortada] = useState(null);
  const [documentoAdjunto, setDocumentoAdjunto] = useState(null);
  const [contenido, setContenido] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  // --- Estados para Categorías ---
  const [availableCategorias, setAvailableCategorias] = useState([]); // Lista de categorías desde la API
  const [selectedCategorias, setSelectedCategorias] = useState([]); // Array de IDs seleccionados
  const [loadingCategorias, setLoadingCategorias] = useState(true); // Para indicar carga
  // -----------------------------

  // --- Fetch Categorías al montar el componente ---
  useEffect(() => {
    const fetchCategorias = async () => {
      setLoadingCategorias(true);
      try {
        const response = await fetch(
          "https://apicodeaderdocumentacion-production.up.railway.app/api/categorias/",
        ); // USA LA URL DE TU API
        if (response.ok) {
          const data = await response.json();
          setAvailableCategorias(data);
        } else {
          console.error("Error fetching categories:", response.statusText);
          setMensaje("Error al cargar categorías.");
          setTipoMensaje("error");
        }
      } catch (error) {
        console.error("Network error fetching categories:", error);
        setMensaje("Error de red al cargar categorías.");
        setTipoMensaje("error");
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar
  // -------------------------------------------

  // --- Handler para cambios en Checkboxes de Categoría ---
  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    const isChecked = event.target.checked;

    if (isChecked) {
      // Añadir solo si no hemos alcanzado el límite de 2
      if (selectedCategorias.length < 2) {
        setSelectedCategorias([...selectedCategorias, categoryId]);
      } else {
        // Prevenir que se marque visualmente si ya hay 2
        event.target.checked = false;
        setMensaje("Solo puedes seleccionar un máximo de 2 categorías.");
        setTipoMensaje("error"); // O 'warning'
        // Limpiar mensaje después de un tiempo
        setTimeout(() => {
          if (
            mensaje === "Solo puedes seleccionar un máximo de 2 categorías."
          ) {
            setMensaje("");
            setTipoMensaje("");
          }
        }, 3000);
      }
    } else {
      // Quitar si se desmarca
      setSelectedCategorias(
        selectedCategorias.filter((id) => id !== categoryId),
      );
    }
  };
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("resumen", resumen);
    formData.append("contenido", contenido);

    if (!portada) {
      setMensaje("Error: Debes seleccionar una imagen de portada.");
      setTipoMensaje("error");
      return;
    }
    formData.append("portada", portada);

    if (documentoAdjunto) {
      formData.append("documento_adjunto", documentoAdjunto);
    }

    // --- Añadir IDs de categorías seleccionadas ---
    // Django REST Framework espera múltiples valores para el mismo key en ManyToManyField
    selectedCategorias.forEach((id) => {
      formData.append("categorias", id.toString());
    });
    // -------------------------------------------

    // Validar si se requiere al menos una categoría (opcional, depende de tus reglas)
    // if (selectedCategorias.length === 0) {
    //     setMensaje("Error: Debes seleccionar al menos una categoría.");
    //     setTipoMensaje("error");
    //     return;
    // }

    try {
      const response = await fetch(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/crear/",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje(`Documento "${data.titulo}" creado correctamente.`);
        setTipoMensaje("success");
        // Limpiar formulario
        setTitulo("");
        setResumen("");
        setContenido("");
        setPortada(null);
        setDocumentoAdjunto(null);
        setSelectedCategorias([]); // Limpiar categorías seleccionadas
        document.getElementById("portada-input").value = null;
        document.getElementById("adjunto-input").value = null;
        // Desmarcar checkboxes visualmente (opcional, el estado ya se limpió)
        availableCategorias.forEach((cat) => {
          const checkbox = document.getElementById(`categoria-${cat.id}`);
          if (checkbox) checkbox.checked = false;
        });
      } else {
        const errorData = await response.json();
        let errorMsg = JSON.stringify(errorData);
        if (errorData.detail) {
          errorMsg = errorData.detail;
          // --- Mostrar errores específicos de categorías si existen ---
        } else if (errorData.categorias) {
          errorMsg = `Categorías: ${errorData.categorias.join(", ")}`;
          // -------------------------------------------------------
        } else if (typeof errorData === "object") {
          errorMsg = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
            )
            .join("; ");
        }
        setMensaje(`Error al crear el documento: ${errorMsg}`);
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje(`Error en la petición: ${error.message}`);
      setTipoMensaje("error");
    }
  };

  // --- Renderizado del Formulario (con sección de categorías) ---
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Crear Nuevo Documento
      </h2>

      {mensaje && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${
            tipoMensaje === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
          role="alert"
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... (Campo Título) ... */}
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            placeholder="Ingrese el título del documento"
          />
        </div>

        {/* ... (Campo Resumen) ... */}
        <div>
          <label
            htmlFor="resumen"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Resumen <span className="text-red-500">*</span>
          </label>
          <textarea
            id="resumen"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            placeholder="Escriba un breve resumen (mínimo 10 caracteres)"
          />
        </div>

        {/* --- Sección de Categorías --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categorías (Selecciona máx. 2)
            {/* Puedes añadir un * si es obligatorio: <span className="text-red-500">*</span> */}
          </label>
          <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-4 max-h-48 overflow-y-auto bg-gray-50">
            {loadingCategorias ? (
              <p className="text-sm text-gray-500">Cargando categorías...</p>
            ) : availableCategorias.length > 0 ? (
              availableCategorias.map((categoria) => {
                // Determinar si el checkbox debe estar deshabilitado
                const isDisabled =
                  selectedCategorias.length >= 2 &&
                  !selectedCategorias.includes(categoria.id);
                return (
                  <div key={categoria.id} className="flex items-center">
                    <input
                      id={`categoria-${categoria.id}`}
                      name="categorias" // Mismo nombre para agruparlos lógicamente
                      type="checkbox"
                      value={categoria.id}
                      checked={selectedCategorias.includes(categoria.id)}
                      onChange={handleCategoryChange}
                      disabled={isDisabled}
                      className={`h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <label
                      htmlFor={`categoria-${categoria.id}`}
                      className={`ml-3 block text-sm ${isDisabled ? "text-gray-400" : "text-gray-700 cursor-pointer"}`}
                    >
                      {/* Asume que el campo se llama 'nombre' en tu modelo Categoria */}
                      {categoria.nombre}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                No hay categorías disponibles.
              </p>
            )}
          </div>
          {/* Mensaje opcional de límite alcanzado */}
          {selectedCategorias.length >= 2 && !loadingCategorias && (
            <p className="text-xs text-indigo-600 mt-1">
              Límite de 2 categorías alcanzado.
            </p>
          )}
        </div>
        {/* ----------------------------- */}

        {/* ... (Campo Contenido - CKEditor) ... */}
        <div>
          <label
            htmlFor="contenido"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contenido <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden ck-editor-container">
            <CKEditor
              editor={ClassicEditor}
              data={contenido}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContenido(data);
              }}
              config={
                {
                  /* configuraciones */
                }
              }
            />
          </div>
        </div>

        {/* ... (Campo Portada) ... */}
        <div>
          <label
            htmlFor="portada-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Imagen de Portada <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="portada-input" // ID para poder resetearlo
            onChange={(e) => setPortada(e.target.files[0])}
            accept="image/*"
            required
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-l-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
          {portada && (
            <span className="text-xs text-gray-500 mt-1 block">
              Archivo seleccionado: {portada.name}
            </span>
          )}
        </div>

        {/* ... (Campo Documento Adjunto) ... */}
        <div>
          <label
            htmlFor="adjunto-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Documento Adjunto (Opcional)
          </label>
          <input
            type="file"
            id="adjunto-input" // ID para poder resetearlo
            onChange={(e) => setDocumentoAdjunto(e.target.files[0])}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-l-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
          {documentoAdjunto && (
            <span className="text-xs text-gray-500 mt-1 block">
              Archivo seleccionado: {documentoAdjunto.name}
            </span>
          )}
        </div>

        {/* ... (Botón de Envío) ... */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Crear Documento
          </button>
        </div>
      </form>
    </div>
  );
  // ------------------------------------------------------------
};

export default CrearDocumento;
