import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSidebar } from '../hooks/useSidebar';

const Layout = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Navbar toggle={toggle} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;