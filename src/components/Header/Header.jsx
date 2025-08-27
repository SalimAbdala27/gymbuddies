// src/components/Header/Header.jsx
import { Link } from 'react-router-dom';
import './Header.scss'; // Import the SCSS file

const Header = () => {
  return (
    <header className="header">
      <h1>Gym Buddies</h1>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </nav>
    </header>
  );
};

export default Header;