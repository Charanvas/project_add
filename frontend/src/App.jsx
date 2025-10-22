import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InventoryForm from './components/InventoryForm';
import InventoryAdmin from './components/InventoryAdmin';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<InventoryForm />} />
          <Route path="/admin" element={<InventoryAdmin />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;