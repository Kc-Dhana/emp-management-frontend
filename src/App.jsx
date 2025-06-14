import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/admin/adminDashboard';

function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>
      <Routes>

        <Route path="/" element={<AdminDashboard />} />
        
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
