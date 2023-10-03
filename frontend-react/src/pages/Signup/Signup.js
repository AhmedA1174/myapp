import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div>
      <h1>Signup Page</h1>
      <Link to="/"><button>Go Back to Home</button></Link>
      <Link to="/login"><button>Go to Login</button></Link>
    </div>
  );
}

export default Signup;
