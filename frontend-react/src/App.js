// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import PolicyDetail from './pages/Dashboard/PolicyDetail/PolicyDetail';
import TestEditor from './pages/Dashboard/PolicyDetail/TestEditor/TestEditor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:policyId" element={<PolicyDetail />} />
          <Route path="/dashboard/:policyId/:testId" element={<TestEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
