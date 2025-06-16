import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upploadMediaToSupabase, supabase } from "../../utill/mediaUpload";
import toast from "react-hot-toast";

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    salary: "",
  });
  const [joinDate, setJoinDate] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Valid 10-digit phone number required";
    if (!formData.salary || isNaN(formData.salary)) newErrors.salary = "Valid salary is required";
    if (!profileImage) newErrors.profileImage = "Profile image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

      const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);

      try {
        await upploadMediaToSupabase(profileImage);
        const imageUrl = supabase.storage.from("images").getPublicUrl(profileImage.name).data.publicUrl;

        const payload = {
          ...formData,
          salary: Number(formData.salary),
          joinDate: joinDate || new Date().toISOString(),
          profileImage: imageUrl,
        };

        await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/employees", payload);

        toast.success("Employee created successfully!");
        navigate("/employee-create");
      } catch (error) {
        console.error("❌ Failed to create employee:", error.response?.data || error.message);
        toast.error("Failed to create employee.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6 mb-12 md:mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.designation && <p className="text-red-600 text-sm mt-1">{errors.designation}</p>}
          </div>

          <div>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="joinDate">
              Join Date
              <span className="block text-sm text-gray-500">When did this employee start working?</span>
            </label>
            <input
              type="date"
              id="joinDate"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.profileImage && <p className="text-red-600 text-sm mt-1">{errors.profileImage}</p>}
          </div>
        </div>

        {previewUrl && (
          <div className="text-center">
            <img src={previewUrl} alt="Preview" className="mt-4 max-h-48 mx-auto rounded-md shadow-md" />
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
