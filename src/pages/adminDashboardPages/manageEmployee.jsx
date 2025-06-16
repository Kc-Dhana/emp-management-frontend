import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManageEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
  const handleView = (id) => {
    const employee = employees.find(e => e._id === id);
    setSelectedEmployee(employee);
  };

  const closeModal = () => setSelectedEmployee(null);

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

      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4 text-center">Employee Details</h3>
            {selectedEmployee.profileImage && (
              <img src={selectedEmployee.profileImage} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
            )}
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
              <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
              <p><strong>Join Date:</strong> {new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
              <p><strong>Created At:</strong> {new Date(selectedEmployee.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedEmployee.updatedAt).toLocaleString()}</p>
            </div>
            <div className="text-center mt-4">
              <button onClick={closeModal} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
