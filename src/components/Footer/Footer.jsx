// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.scss'; // Import the SCSS file

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Gym Buddies</p>
      <nav>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
    </footer>
  );
};

export default Footer;