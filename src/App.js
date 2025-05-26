// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";

// Nuevas páginas (sistema de documentación web)
import ListaDocumentaciones from "./pages/ListaDocumentaciones";
import DetalleDocumentacion from "./pages/DetalleDocumentacion";
import FormularioDocumentacion from "./pages/FormularioDocumentacion";
import FormularioSeccion from "./pages/FormularioSeccion";

function App() {
  return (
    <GoogleOAuthProvider clientId="855418438044-6fa9odtp2inrmmkrfoh1bgaj98juebq7.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <div>
            <div className="max-w-screen-2xl mx-auto grid grid-cols-[180px_1fr]">
              <Header />

              <div className="col-start-2 col-end-3">
                <main className="px-8 sm:px-10 md:px-12 lg:px-16 py-10">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Nuevas rutas para el sistema de documentación web */}
                    <Route path="/documentaciones" element={<ListaDocumentaciones />} />
                    <Route path="/documentaciones/:id" element={<DetalleDocumentacion />} />
                    <Route path="/documentaciones/crear" element={<FormularioDocumentacion />} />
                    <Route path="/secciones/crear" element={<FormularioSeccion />} />
                  </Routes>
                </main>
              </div>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
