import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, logoutAdmin } from '../utils/auth.js';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAdminAuthenticated();

  function handleLogout() {
    logoutAdmin();
    navigate('/');
  }

  function isActive(path) {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          HireHub
        </Link>

        <nav className="header-nav" style={{ display: 'flex' }}>
          <Link
            to="/"
            className={`header-nav-link${isActive('/') ? ' active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/apply"
            className={`header-nav-link${isActive('/apply') ? ' active' : ''}`}
          >
            Apply
          </Link>
          <Link
            to="/admin"
            className={`header-nav-link${isActive('/admin') ? ' active' : ''}`}
          >
            Admin
          </Link>
        </nav>

        <div className="header-actions">
          {authenticated ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/admin" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;