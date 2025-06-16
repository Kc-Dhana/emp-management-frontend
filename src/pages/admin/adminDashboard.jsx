import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FiMenu, FiUserPlus, FiEdit, FiEye, FiTrash2, FiX } from "react-icons/fi";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <span className="font-bold text-2xl">Admin Dashboard</span>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("employee-create")}
          >
            <FiUserPlus size={20} /> Create Employee
          </button>
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("employee-manage")}
          >
            <FiEdit size={20} /> Manage Employees
          </button>
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("employee-view")}
          >
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header (mobile only) */}
        <header className="flex items-center justify-between bg-white shadow-md p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div></div>
        </header>

        {/* Dynamic Content from Routes */}
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
