import React, { useState } from "react";

const CrearDocumento = () => {
  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [portada, setPortada] = useState(null);
  const [documentoAdjunto, setDocumentoAdjunto] = useState(null);
  const [contenido, setContenido] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("resumen", resumen);
    formData.append("contenido", contenido);
    formData.append("portada", portada);
    if (documentoAdjunto) {
      formData.append("documento_adjunto", documentoAdjunto);
    }
    // Puedes agregar también: autor, seccion, categorias según sea necesario

    try {
      const response = await fetch(
        "http://localhost:8000/api/documentos/crear/",
        {
          method: "POST",
          body: formData,
          credentials: "include", // necesario si usas autenticación con cookies
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMensaje(`Documento creado correctamente: ${data.titulo}`);
      } else {
        const error = await response.json();
        setMensaje(`Error al crear el documento: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      setMensaje(`Error en la petición: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Crear Documento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Resumen:</label>
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contenido:</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Portada:</label>
          <input
            type="file"
            onChange={(e) => setPortada(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label>Documento Adjunto (opcional):</label>
          <input
            type="file"
            onChange={(e) => setDocumentoAdjunto(e.target.files[0])}
          />
        </div>
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearDocumento;
