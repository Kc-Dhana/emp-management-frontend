import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/admin/adminDashboard';
import EmployeeCreate from './pages/adminDashboardPages/employeeCreate';
import ManageEmployee from './pages/adminDashboardPages/manageEmployee';

function App() {

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<AdminDashboard />}>
          <Route index element={<div>Welcome to Employee Management</div>} />
          <Route path="employee-manage" element={<ManageEmployee />} />
          <Route path="employee-create" element={<EmployeeCreate />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
