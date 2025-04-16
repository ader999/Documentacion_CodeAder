import React, { useEffect, useState } from "react";
import axios from "axios";
import FormularioDocumento from "./FormularioDocumento";

function App() {
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/documentos/",
      )
      .then((res) => setDocumentos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const agregarDocumento = (nuevoDocumento) => {
    setDocumentos([nuevoDocumento, ...documentos]);
  };

  return (
    <div>
      <h1>Lista de Documentos</h1>

      <FormularioDocumento onDocumentoCreado={agregarDocumento} />

      <ul>
        {documentos.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.titulo}</strong> — {doc.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
