import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, LayoutDashboard, Users } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Package size={32} />
          <span>PropIT Dashboard</span>
        </div>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <ClipboardList size={20} />
              Properties
            </Link>
          </li>
          <li>
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              Admin
            </Link>
          </li>
          <li>
            <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>
              <Users size={20} />
              User Management
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;