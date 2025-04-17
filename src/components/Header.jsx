// src/components/Header.jsx
import React from "react";

function Header() {
  const p_top = "50,15";
  const p_bl = "15,85"; // bottom-left
  const p_br = "85,85"; // bottom-right
  const p_mid_l = "32.5,50"; // midpoint left side
  const p_mid_r = "67.5,50"; // midpoint right side
  const p_mid_b = "50,85"; // midpoint base
  // --- FIN DE LAS DEFINICIONES ---

  return (
    // Clases clave: h-screen (ocupa altura) sticky top-0 (se pega arriba al scrollear)
    <aside className="w-[180px] h-screen sticky top-0 bg-gray-50 py-8 px-4 border-r border-gray-200">
      {/* ... (contenido interno del Header sin cambios) ... */}
      <div className="flex flex-col items-start mb-6">
        <a href="/" className="relative block mb-4">
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo Triángulo Fragmentado"
          >
            {/* Triángulo superior */}
            <polygon
              className="fill-black"
              points={`${p_top} ${p_mid_r} ${p_mid_l}`}
            />
            {/* Triángulo inferior izquierdo */}
            <polygon
              className="fill-black"
              points={`${p_bl} ${p_mid_b} ${p_mid_l}`}
            />
            {/* Triángulo inferior derecho */}
            <polygon
              className="fill-black"
              points={`${p_br} ${p_mid_b} ${p_mid_r}`}
            />
          </svg>
        </a>
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-1.5">
            <li>
              <a
                href="/"
                className="block text-base font-semibold text-gray-900 transition-opacity duration-300 no-underline"
              >
                CodeD
              </a>
            </li>
            <li>
              <a
                href="/research/crossing_the_uncanny_valley_of_voice"
                className="block text-base font-medium text-gray-600 opacity-50 transition-opacity duration-300 hover:opacity-100 hover:font-semibold no-underline"
              >
                Research
              </a>
            </li>
            <li>
              <a
                href="/team"
                className="block text-base font-medium text-gray-600 opacity-50 transition-opacity duration-300 hover:opacity-100 hover:font-semibold no-underline"
              >
                Team
              </a>
            </li>
          </ul>
          <div className="flex flex-col gap-4">
            <hr className="border-t border-gray-200" />
            <ul className="flex flex-col gap-1.5">
              <li>
                <a
                  href="/research/crossing_the_uncanny_valley_of_voice#demo"
                  className="block text-base font-medium text-gray-600 opacity-50 transition-opacity duration-300 hover:opacity-100 hover:font-semibold no-underline"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block text-base font-medium text-gray-600 opacity-50 transition-opacity duration-300 hover:opacity-100 hover:font-semibold no-underline cursor-pointer"
                >
                  Log in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Header;
