// src/components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import { useState } from 'react';
import { useAuth } from '../../auth';
import Logo from '../../assets/apple-touch-icon.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOutUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

    // Helper to show initials if no photo
    const getInitials = (name) => {
      if (!name) return '';
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    };

  return (
    <header className="header">
        <div className="header-left">
        <img src={Logo} alt="Logo" className="logo" />
        <h1>Gym Buddies</h1>
      </div>
      <div className="header-right">
        {/* Profile circle if logged in */}
        {user && (
          <div className="profile-circle" title={user.displayName || user.email}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <span>{getInitials(user.displayName)}</span>
            )}
          </div>
        )}
      <button className="burger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        {isMenuOpen && (
          <button className="close-btn" onClick={toggleMenu}>
            &times;
          </button>
        )}

        <Link to="/" className="nav-link" onClick={toggleMenu}>
          Home
        </Link>

        {/* Only show profile link if logged in */}
        {user && (
          <Link to="/friends" className="nav-link" onClick={toggleMenu}>
            Friends
          </Link>
        )}

        <Link to="/login" className="nav-link" onClick={toggleMenu}> Login </Link>
      </nav>
    </header>
  );
};

export default Header;
