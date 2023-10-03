import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/signup"><button>Go to Signup</button></Link>
      <Link to="/login"><button>Go to Login</button></Link>
    </div>
  );
}

export default Home;
