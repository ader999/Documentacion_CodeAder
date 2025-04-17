import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem" }}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
