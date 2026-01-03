import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust path as needed
import Header from '../components/header/Header';   // Adjust path as needed

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="w-full flex-grow p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout;