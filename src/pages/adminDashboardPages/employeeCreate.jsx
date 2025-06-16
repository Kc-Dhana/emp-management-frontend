import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upploadMediaToSupabase, supabase } from "../../../utill/mediaUpload";

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
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

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/employees",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/employee-view");
    } catch (error) {
      console.error("Error creating employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="input" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

        <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="input" />
        {errors.designation && <p className="text-red-600 text-sm">{errors.designation}</p>}

        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="input" />
        {errors.department && <p className="text-red-600 text-sm">{errors.department}</p>}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

        <input type="text" name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} className="input" />
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

        <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="input" />
        {errors.salary && <p className="text-red-600 text-sm">{errors.salary}</p>}

        <input type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} className="input" />

        <input type="file" onChange={handleImageChange} className="input" />
        {errors.profileImage && <p className="text-red-600 text-sm">{errors.profileImage}</p>}

        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
}
