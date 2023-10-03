import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <Link to="/policy-detail"><button>Go to Policy Detail</button></Link>
    </div>
  );
}

export default Dashboard;
