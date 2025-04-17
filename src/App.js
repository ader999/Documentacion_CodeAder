// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Asegúrate de importar esto
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import DocumentoDetalle from "./pages/DocumentoDetalle";
import CrearDocumento from "./pages/CrearDocumento";

function App() {
  return (
    <Router>
      <div>
        <div className="max-w-screen-2xl mx-auto grid grid-cols-[180px_1fr]">
          <Header />

          <div className="col-start-2 col-end-3">
            <main className="px-8 sm:px-10 md:px-12 lg:px-16 py-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/documentos/:id" element={<DocumentoDetalle />} />
                <Route path="/crear-documento" element={<CrearDocumento />} />
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
