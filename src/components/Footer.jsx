// src/components/Footer.jsx
import React, { useRef, useEffect } from "react"; // <--- Importa useRef y useEffect

// --- Tus componentes SVG (LogoSesameText, IconX, IconLinkedIn) permanecen igual ---
const LogoSesameText = () => (
  <div className="w-40 h-10 flex items-center justify-center">
    <svg fill="none" viewBox="0 0 102 16" className="w-full h-full text-white">
      <text
        x="0"
        y="12"
        fill="currentColor"
        fontSize="20"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        CodeD
      </text>
    </svg>
  </div>
);

const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 51 50"
    className="block w-7 h-7 text-white"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.423 7.5a3 3 0 0 0-3 3v29a3 3 0 0 0 3 3h29a3 3 0 0 0 3-3v-29a3 3 0 0 0-3-3zm24.615 7h-3.51l-5.774 6.72-5.034-6.72h-7.297l8.683 11.48-8.221 9.52h3.51l6.374-7.327L30.31 35.5h7.112l-9.052-12.087zM33.22 33.353h-1.94L18.535 16.507h2.124z"
      clipRule="evenodd"
    />
  </svg>
);

const IconLinkedIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 51 50"
    className="block w-7 h-7 text-white"
  >
    <path
      fill="currentColor"
      d="M37.398 37.823h-5.186V29.7c0-1.936-.034-4.43-2.697-4.43-2.7 0-3.114 2.11-3.114 4.29v8.261h-5.186V21.121h4.979v2.282h.07a5.46 5.46 0 0 1 4.911-2.697c5.256 0 6.226 3.457 6.226 7.955zM15.364 18.838a3.01 3.01 0 1 1-.001-6.018 3.01 3.01 0 0 1 0 6.018m2.593 18.985h-5.192V21.12h5.192zm22.027-29.82H10.159a2.554 2.554 0 0 0-2.582 2.523v29.949A2.556 2.556 0 0 0 10.159 43h29.825a2.56 2.56 0 0 0 2.593-2.525V10.523a2.56 2.56 0 0 0-2.593-2.522"
    />
  </svg>
);
// ---------------------------------------------------------------------------

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const videoSrc = "/videos/footer.mp4";
  const videoRef = useRef(null); // <--- Crea la referencia para el video

  // --- Lógica para reiniciar el video ---
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const handleWaiting = () => {
      console.log("Video background en espera (buffering)... Reiniciando.");
      if (
        !videoElement.paused &&
        !videoElement.ended &&
        videoElement.readyState > 2
      ) {
        videoElement.currentTime = 0;
        videoElement.play().catch((error) => {
          console.error("Error al intentar reanudar video del footer:", error);
        });
      }
    };

    videoElement.addEventListener("waiting", handleWaiting);

    // Función de limpieza para remover el listener
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("waiting", handleWaiting);
      }
    };
  }, []); // <--- Array de dependencias vacío, se ejecuta solo al montar/desmontar

  return (
    <footer className="relative text-white pt-16 md:pt-24 pb-12 md:pb-20 overflow-hidden">
      {/* Fondo de video y overlay */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef} // <--- Asigna la referencia al elemento video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src={videoSrc}
        >
          Tu navegador no soporta videos HTML5.
        </video>
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/20"></div>{" "}
        {/* Ajusta la opacidad si es necesario */}
      </div>

      {/* Contenedor del contenido centrado (resto del footer sin cambios) */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-start">
        {/* Logo de texto */}
        <div className="pb-10 md:pb-12">
          <LogoSesameText />
        </div>

        {/* Navegación principal y Social (Desktop) */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 md:mb-6">
          <nav className="flex flex-col md:flex-row text-sm text-gray-200 opacity-80 gap-6 md:gap-8 mb-8 md:mb-0">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="/" className="hover:text-white transition-colors">
              Research
            </a>
            <a href="/team" className="hover:text-white transition-colors">
              Team
            </a>
            <button className="hover:text-white transition-colors bg-transparent border-0 p-0 text-inherit cursor-pointer">
              Contact us
            </button>
          </nav>
          {/* Iconos Sociales (Desktop) */}
          <div className="hidden md:flex gap-6">
            <button
              className="bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Sigueme en Twitter"
              onClick={() => window.open('https://twitter.com/codeader', '_blank', 'noopener,noreferrer')}
            >
              <IconX />
            </button>
            <button
              className="bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Sigueme en LinkedIn"
              onClick={() => window.open('https://linkedin.com/company/codeader', '_blank', 'noopener,noreferrer')}
            >
              <IconLinkedIn />
            </button>
          </div>
        </div>

        {/* Separador */}
        <hr className="border-white/20 w-full my-6 md:my-8" />

        {/* Iconos Sociales (Mobile) */}
        <div className="flex md:hidden gap-8 mb-10">
          <button
            className="bg-transparent border-0 p-0 cursor-pointer"
            aria-label="Sigueme en Twitter"
            onClick={() => window.open('https://twitter.com/codeader', '_blank', 'noopener,noreferrer')}
          >
            <IconX />
          </button>
          <button
            className="bg-transparent border-0 p-0 cursor-pointer"
            aria-label="Sigueme en LinkedIn"
            onClick={() => window.open('https://linkedin.com/company/codeader', '_blank', 'noopener,noreferrer')}
          >
            <IconLinkedIn />
          </button>
        </div>

        {/* Copyright y Legales */}
        <div className="w-full flex flex-col-reverse sm:flex-row justify-between gap-6 text-xs text-white/50 md:text-white/90">
          <p>Copyright © {currentYear} CodeAder. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
