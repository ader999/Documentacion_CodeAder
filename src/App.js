// src/App.js
import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer"; // Importar Footer

function App() {
  return (
    <div>
      <div className="max-w-screen-2xl mx-auto grid grid-cols-[180px_1fr]">
        {/* Header (columna 1) - Se mantendrá fijo por sus estilos internos */}
        <Header />

        {/* Contenido Principal + Footer (columna 2) - Esta es la sección que hará scroll */}
        <div className="col-start-2 col-end-3">
          <main className="px-8 sm:px-10 md:px-12 lg:px-16 py-10">
            <Home />
            {/* ... Contenido adicional y placeholders ... */}
            <div className="mt-10 md:mt-16 lg:mt-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Imagen 1</span>
                </div>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Imagen 2</span>
                </div>
              </div>
              <a
                href="#"
                className="block w-full bg-white p-4 rounded-lg shadow text-center text-gray-800 font-medium hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>Careers at Sesame</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  className="inline-block ml-2"
                >
                  <path
                    fill="#111"
                    d="M11.742 8.808c0 .496-.38.877-.83.877-.458 0-.825-.397-.825-.854V5.986l.13-3.157-1.235 1.388-7.275 7.275a.83.83 0 0 1-.595.26c-.458 0-.862-.412-.862-.854 0-.214.092-.428.267-.603L7.784 3.02 9.172 1.8l-3.286.106H3.17c-.458 0-.847-.366-.847-.808 0-.45.359-.831.87-.831h7.656c.542 0 .892.358.892.885z"
                  ></path>
                </svg>
              </a>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
