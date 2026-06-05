import { Link } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import "./Navbar.css";

function Navbar() {
  const { role, toggleRole } = useRole();
  const isAdmin = role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏥</span>
          <span className="brand-text">Plum OPD</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/upload" className="nav-link nav-link-active">Submit Claim</Link>
          <Link to="/history" className="nav-link">
            {isAdmin ? '📋 All Claims' : 'My Claims'}
          </Link>
          {isAdmin && <Link to="/dashboard" className="nav-link">📊 Dashboard</Link>}
          <Link to="/policy" className="nav-link">📄 Policy Terms</Link>
          
          <button 
            className={`role-toggle ${isAdmin ? 'admin-mode' : 'user-mode'}`}
            onClick={toggleRole}
            title={`Switch to ${isAdmin ? 'User' : 'Admin'} Mode`}
          >
            <span className="role-icon">{isAdmin ? '👨‍💼' : '👤'}</span>
            <span className="role-text">{isAdmin ? 'Admin' : 'User'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;