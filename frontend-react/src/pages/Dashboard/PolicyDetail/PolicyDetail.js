import React from 'react';
import { Link } from 'react-router-dom';

const PolicyDetail = () => {
  return (
    <div>
      <h1>Policy Detail Page</h1>
      <Link to="/test-editor"><button>Go to Test Editor</button></Link>
    </div>
  );
}

export default PolicyDetail;
