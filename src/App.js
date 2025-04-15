import React, { useEffect, useState } from "react";
import axios from "axios";
import FormularioTarea from "./FormularioTarea";

function App() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://apicodeaderdocumentacion-production.up.railway.app/api/tareas/",
      )
      .then((res) => setTareas(res.data))
      .catch((err) => console.log(err));
  }, []);

  const agregarTarea = (nuevaTarea) => {
    setTareas([nuevaTarea, ...tareas]);
  };

  const toggleCompletada = (id) => {
    axios
      .patch(
        `https://apicodeaderdocumentacion-production.up.railway.app/api/tareas/${id}/toggle-completada/`,
      )
      .then((res) => {
        const nuevasTareas = tareas.map((tarea) =>
          tarea.id === id ? res.data : tarea,
        );
        setTareas(nuevasTareas);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <FormularioTarea onTareaCreada={agregarTarea} />
      <ul>
        {tareas.map((tarea) => (
          <li
            key={tarea.id}
            style={{ cursor: "pointer" }}
            onClick={() => toggleCompletada(tarea.id)}
          >
            {tarea.titulo} - {tarea.completada ? "✔️" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
