import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/admin/adminDashboard';
import EmployeeCreate from './pages/adminDashboardPages/employeeCreate';
import EmployeeUpdate from './pages/adminDashboardPages/employeeUpdate';
import EmployeeView from './pages/adminDashboardPages/employeeView';
import EmployeeDelete from './pages/adminDashboardPages/employeeDelete';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />}>
          <Route index element={<div>Welcome to Employee Management</div>} />
          <Route path="employee-create" element={<EmployeeCreate />} />
          <Route path="employee-update" element={<EmployeeUpdate />} />
          <Route path="employee-view" element={<EmployeeView />} />
          <Route path="employee-delete" element={<EmployeeDelete />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
