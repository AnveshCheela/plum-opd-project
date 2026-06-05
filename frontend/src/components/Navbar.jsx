import { Link, useLocation } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import "./Navbar.css";

function Navbar() {
  const { role, toggleRole } = useRole();
  const isAdmin = role === 'admin';
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <div className="brand-logo">🏥</div>
            <span className="brand-text">Plum <span className="brand-dot">OPD</span></span>
          </Link>
          <span className="role-badge">{isAdmin ? 'ADMIN' : 'EMPLOYEE'}</span>
        </div>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`}>New Claim</Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
            {isAdmin ? 'All Claims' : 'My Claims'}
          </Link>
          {isAdmin && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/review" className={`nav-link ${isActive('/review') ? 'active' : ''}`}>
                Review Claims
              </Link>
            </>
          )}
          <Link to="/policy" className={`nav-link ${isActive('/policy') ? 'active' : ''}`}>Policy Terms</Link>

          <button
            className="role-toggle"
            onClick={toggleRole}
            title={`Switch to ${isAdmin ? 'User' : 'Admin'} Mode`}
          >
            {isAdmin ? 'Switch to Employee' : 'Switch to Admin'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;