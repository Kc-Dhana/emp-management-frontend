import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUserPlus, FiEdit, FiEye, FiTrash2, FiX } from "react-icons/fi";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close sidebar after navigation on mobile
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Sidebar Header with close button (mobile only) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <span className="font-bold text-2xl">Admin Dashboard</span>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex flex-col p-4 space-y-4">
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("/admin/create")}
          >
            <FiUserPlus size={20} /> Create Employee
          </button>
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("/admin/update")}
          >
            <FiEdit size={20} /> Update Employee
          </button>
          <button
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-indigo-500 hover:text-white rounded"
            onClick={() => handleNavigate("/admin/view")}
          >
            <FiEye size={20} /> View Employees
          </button>
          <button
            className="flex items-center gap-2 p-3 text-red-600 hover:bg-red-600 hover:text-white rounded"
            onClick={() => handleNavigate("/admin/delete")}
          >
            <FiTrash2 size={20} /> Delete Employee
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
          <div></div> {/* Placeholder for alignment */}
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          <h2 className="text-3xl font-bold mb-6">
            Welcome to Employee Management
          </h2>
          <p className="text-gray-600 max-w-xl">
            Use the sidebar to navigate between creating, updating, viewing, and deleting employees.
          </p>
        </main>
      </div>
    </div>
  );
}