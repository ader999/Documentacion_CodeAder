import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function DocumentoDetalle() {
  const { id } = useParams();
  const [documento, setDocumento] = useState(null);

  useEffect(() => {
    fetch(
      `https://apicodeaderdocumentacion-production.up.railway.app/documentos/`,
    )
      .then((res) => res.json())
      .then((data) => setDocumento(data))
      .catch((err) => console.error("Error cargando documento:", err));
  }, [id]);

  if (!documento) return <p>Cargando documento...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{documento.titulo}</h2>
      <p className="text-gray-700">{documento.descripcion}</p>
      {documento.archivo && (
        <a
          href={documento.archivo}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-600 underline"
        >
          Descargar documento
        </a>
      )}
    </div>
  );
}

export default DocumentoDetalle;
