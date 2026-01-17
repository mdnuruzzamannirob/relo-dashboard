import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar stays fixed to the viewport */}
      <Sidebar
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />

      {/* This div takes the remaining width. 
        ml-64 (256px) or ml-24 (96px) ensures the content 
        starts exactly where the sidebar ends.
      */}
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          sidebarVisible ? "ml-64" : "ml-24"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
