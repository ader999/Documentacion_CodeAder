// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    // Clases clave: h-screen (ocupa altura) sticky top-0 (se pega arriba al scrollear)
    <aside className="w-[180px] h-screen sticky top-0 bg-gray-50 py-8 px-4 border-r border-gray-200">
      {/* ... (contenido interno del Header sin cambios) ... */}
      <div className="flex flex-col items-start mb-6">
        <a href="/" className="relative block mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 21 24"
            className="w-[1.125rem] h-[1.25rem] text-gray-900"
          >
            <path
              fill="currentColor"
              d="M20.556 11.936V23.87c-2.16 0-4.184-.582-5.93-1.598a11.94 11.94 0 0 1-5.93-10.337V0c2.16 0 4.184.582 5.93 1.598a11.94 11.94 0 0 1 5.93 10.338M2.926.798A5.7 5.7 0 0 0 0 0v5.968a5.99 5.99 0 0 0 2.925 5.169c.86.509 1.86.798 2.925.798V5.969A5.99 5.99 0 0 0 2.925.798"
            ></path>
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
