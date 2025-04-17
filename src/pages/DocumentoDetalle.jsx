import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DocumentoDetalle() {
  const { id } = useParams();
  const [documento, setDocumento] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/${id}/`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Documento no encontrado");
        }
        return res.json();
      })
      .then((data) => setDocumento(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!documento) return <div>Cargando...</div>;

  const archivoUrl = `https://apicodeaderdocumentacion-production.up.railway.app${documento.archivo}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{documento.titulo}</h2>
      <p className="mb-4">{documento.descripcion}</p>
      <div dangerouslySetInnerHTML={{ __html: documento.contenido }} />
      {documento.archivo && (
        <a
          href={archivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Ver archivo PDF
        </a>
      )}
    </div>
  );
}

export default DocumentoDetalle;
