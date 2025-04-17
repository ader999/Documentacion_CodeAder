// src/pages/Home.jsx
// (Sin cambios respecto a la versión anterior ajustada)
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 pb-20 md:pb-24 lg:pb-32 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-medium leading-none tracking-tight text-gray-900">
        <span className="block">Bringing</span>
        <span className="block">the computer</span>
        <span className="block">to life</span>
      </h1>
      <div className="text-base md:text-xl font-medium leading-tight tracking-wide text-gray-600">
        <p>
          We believe in a future where computers are lifelike. They will see,
          hear, and collaborate with us the way we’re used to. A natural human
          voice is key to unlocking this future.
        </p>
        <p className="mt-5 font-semibold text-gray-800">
          To start, we have two goals.
        </p>
      </div>
      <hr className="border-t border-gray-200" />
      <div>
        <p className="text-base md:text-xl font-medium text-gray-500 pointer-events-none select-none">
          01
        </p>
        <div className="mt-6 flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-gray-900">
              A personal companion
            </h2>
            <p className="mt-4 text-base md:text-xl font-medium leading-tight tracking-wide text-gray-600">
              An ever-present brilliant friend and conversationalist, keeping
              you informed and organized, helping you be a better version of
              yourself.
              <br />
              Try our research{" "}
              <a
                href="/research/crossing_the_uncanny_valley_of_voice#demo"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                demo
              </a>
              .
            </p>
          </div>
          {/* Imagen/Enlace iría aquí */}
        </div>
      </div>
      {/* Otras secciones irían aquí */}
    </div>
  );
};

export default Home;
