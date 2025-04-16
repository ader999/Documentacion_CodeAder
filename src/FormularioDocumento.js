import React, { useState, useEffect } from "react";
import axios from "axios";

function FormularioDocumento({ onDocumentoCreado }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [slug, setSlug] = useState("");
  const [seccionId, setSeccionId] = useState("");
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/secciones/",
      )
      .then((res) => setSecciones(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoDocumento = {
      titulo,
      contenido,
      slug,
      seccion: seccionId,
    };

    axios
      .post(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/",
        nuevoDocumento,
      )
      .then((res) => {
        onDocumentoCreado(res.data);
        setTitulo("");
        setContenido("");
        setSlug("");
        setSeccionId("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Crear nuevo documento</h3>
      <div>
        <label>Título:</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
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
        <label>Slug:</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Sección:</label>
        <select
          value={seccionId}
          onChange={(e) => setSeccionId(e.target.value)}
          required
        >
          <option value="">Seleccione una sección</option>
          {secciones.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.titulo}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Guardar Documento</button>
    </form>
  );
}

export default FormularioDocumento;
