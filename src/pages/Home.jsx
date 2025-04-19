// src/pages/Home.jsx
// (Sin cambios respecto a la versión anterior ajustada)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/",
      )
      .then((res) => setDocumentos(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 pb-20 md:pb-24 lg:pb-32 max-w-[60%] mx-auto">
      <h1 className="text-4xl md:text-5xl font-medium leading-none tracking-tight text-gray-900">
        <span className="block">Ultimos</span>
        <span className="block">Documentos</span>
        <span className="block">Subidos</span>
      </h1>
      <div className="text-base md:text-xl font-medium leading-tight tracking-wide text-gray-600">
        <ul>
          {documentos.map((doc, index) => {
            const cleanResumen = doc.resumen
              .replace(/<[^>]+>/g, "") // elimina etiquetas HTML
              .slice(0, 300); // corta a 300 caracteres

            console.log(`HOME - ID: ${doc.id}, Portada Value:`, doc.portada);
            console.log(
              `HOME - ID: ${doc.id}, Generated URL:`,
              `https://apicodeaderdocumentacion-production.up.railway.app${doc.portada}`,
            );

            return (
              <li key={doc.id} className="documento">
                {index !== 0 && (
                  <hr className="border-gray-300 my-6 border-t-2" />
                )}

                <img
                  src={`https://apicodeaderdocumentacion-production.up.railway.app${doc.portada}`}
                  alt={`Portada de ${doc.titulo}`}
                  className="w-full h-auto mb-4 object-cover transition-opacity duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-md"
                  loading="lazy"
                  sizes="100vw"
                />

                <p className="text-gray-700">{cleanResumen}...</p>

                <Link
                  to={`/documentos/${doc.id}`}
                  className="text-blue-500 hover:underline"
                >
                  <p className="mt-5 font-semibold text-gray-800">
                    {doc.titulo}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
