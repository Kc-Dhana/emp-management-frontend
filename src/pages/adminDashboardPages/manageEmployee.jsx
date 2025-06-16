import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManageEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/employees");
      setEmployees(res.data.employees || []);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`);
      toast.success("Employee deleted");
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const handleEdit = (id) => navigate(`/employee-update/${id}`);
  const handleView = (id) => navigate(`/employee-view/${id}`);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">Manage Employees</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.phone}</td>
                  <td className="p-3">{emp.salary}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleView(emp._id)} className="text-blue-500 hover:text-blue-700" title="View"><FaEye /></button>
                    <button onClick={() => handleEdit(emp._id)} className="text-green-500 hover:text-green-700" title="Edit"><FaEdit /></button>
                    <button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
