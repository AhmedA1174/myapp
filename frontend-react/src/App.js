import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import './App.css';

// Update the import paths
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* You can add a Navbar component here if you have one */}
        <Routes>  {/* Change Switch to Routes */}
          {/* Update the way you use Route */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>
        {/* You can add a Footer component here if you have one */}
      </div>
    </Router>
  );
}

export default App;
