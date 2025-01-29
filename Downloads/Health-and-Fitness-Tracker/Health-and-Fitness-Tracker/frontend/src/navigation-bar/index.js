import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ border: '1px solid grey' }}>
      <div className="d-flex align-items-center">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo"
            style={{ maxWidth: '70px', maxHeight: '70px', marginLeft: '20px' }}
          />
        </Link>
      </div>

      <div className="text-white ml-3 p-0">
        <h4 style={{ color: '#ddb42b' }}>HEALTH & FITNESS TRACKER</h4>
        <p>"Empower Your Wellness Journey: Track, Transform, Thrive!."</p>
      </div>

      <div className="flex-grow-1"></div>

      <div className="navbar-nav">
      <li className="nav-item">
          <Link className="nav-link" to="/contact">Contact Us</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">Profile</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/logout">Logout</Link>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
