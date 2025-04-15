// frontend/src/FormularioTarea.js
import React, { useState } from "react";
import axios from "axios";

function FormularioTarea({ onTareaCreada }) {
  const [titulo, setTitulo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    axios
      .post(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/crear_tarea/",
        {
          titulo,
          completada: false,
        },
      )
      .then((res) => {
        onTareaCreada(res.data); // para actualizar la lista
        setTitulo("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default FormularioTarea;
