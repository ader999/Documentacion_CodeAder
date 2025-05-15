import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DocumentoDetalle() {
  const { id } = useParams();
  const [documento, setDocumento] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener el token de autenticación del usuario
    const storedUser = localStorage.getItem('user');
    let headers = {};
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const accessToken = userData.accessToken;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    fetch(
      `https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/${id}/`,
      {
        method: 'GET',
        headers: headers
      }
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Se requiere autenticación para ver este documento");
          } else {
            throw new Error("Documento no encontrado");
          }
        }
        return res.json();
      })
      .then((data) => {
        console.log(`DETAIL - ID: ${id}, Received Data:`, data);
        console.log(`DETAIL - ID: ${id}, Portada Value:`, data.portada);
        setDocumento(data);
      })
      .catch((err) => {
        console.error("Error al cargar documento:", err);
        setError(err.message);
      });
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!documento) return <div>Cargando...</div>;

  // Usar el archivo URL tal como viene si existe, de lo contrario construir una URL relativa
  const archivoUrl = documento.archivo && documento.archivo.startsWith('http') 
    ? documento.archivo 
    : documento.archivo ? `https://apicodeaderdocumentacion-production.up.railway.app${documento.archivo}` : null;

  return (
    <div className="rounded-lg max-w-[60%] mx-auto">
      {/* Usar la URL completa que ya proporciona el backend */}
      <img
        src={documento.portada}
        alt={documento.titulo}
        className="w-full h-auto mb-4 object-cover transition-opacity duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-md"
      />
      <h1 className="text-4xl font-bold mb-4">{documento.titulo}</h1>
      <p className="mb-4, font-black">{documento.descripcion}</p>
      <hr className="border-gray-300 my-6 border-t-2" />
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
