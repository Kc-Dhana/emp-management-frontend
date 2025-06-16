import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function ManageEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // View modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch employees with pagination
  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employees?page=${page}&limit=5`
      );
      setEmployees(res.data.employees || []);
      setCurrentPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  // Delete employee
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`);
      toast.success("Employee deleted");
      fetchEmployees(currentPage);
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  // View employee modal open
  const handleView = (id) => {
    const employee = employees.find((e) => e._id === id);
    setSelectedEmployee(employee);
  };
  const closeViewModal = () => setSelectedEmployee(null);

  // Edit employee modal open
  const handleEdit = (id) => {
    const employee = employees.find((e) => e._id === id);
    setSelectedEmployeeForEdit(employee);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployeeForEdit(null);
  };

  // Edit form input handler
  const handleEditChange = (field, value) => {
    setSelectedEmployeeForEdit((prev) => ({ ...prev, [field]: value }));
  };

  // Submit edit form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...updatedData } = selectedEmployeeForEdit;
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${_id}`, updatedData);
      toast.success("Employee updated successfully");
      fetchEmployees(currentPage);
      closeEditModal();
    } catch {
      toast.error("Failed to update employee");
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">Manage Employees</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <>
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
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.phone}</td>
                    <td className="p-3">{emp.salary}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleView(emp._id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(emp._id)}
                        className="text-green-500 hover:text-green-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-1 border rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4 text-center">Employee Details</h3>
            {selectedEmployee.profileImage && (
              <img
                src={selectedEmployee.profileImage}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
            )}
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedEmployee.name}
              </p>
              <p>
                <strong>Designation:</strong> {selectedEmployee.designation}
              </p>
              <p>
                <strong>Department:</strong> {selectedEmployee.department}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEmployee.phone}
              </p>
              <p>
                <strong>Salary:</strong> {selectedEmployee.salary}
              </p>
              <p>
                <strong>Join Date:</strong>{" "}
                {selectedEmployee.joinDate
                  ? new Date(selectedEmployee.joinDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedEmployee.createdAt
                  ? new Date(selectedEmployee.createdAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {selectedEmployee.updatedAt
                  ? new Date(selectedEmployee.updatedAt).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedEmployeeForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Employee</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <input
                type="text"
                value={selectedEmployeeForEdit.name || ""}
                onChange={(e) => handleEditChange("name", e.target.value)}
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                value={selectedEmployeeForEdit.email || ""}
                onChange={(e) => handleEditChange("email", e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                value={selectedEmployeeForEdit.phone || ""}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                placeholder="Phone"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                value={selectedEmployeeForEdit.designation || ""}
                onChange={(e) => handleEditChange("designation", e.target.value)}
                placeholder="Designation"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                value={selectedEmployeeForEdit.department || ""}
                onChange={(e) => handleEditChange("department", e.target.value)}
                placeholder="Department"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                value={selectedEmployeeForEdit.salary || ""}
                onChange={(e) => handleEditChange("salary", e.target.value)}
                placeholder="Salary"
                className="w-full p-2 border rounded"
                required
                min="0"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
