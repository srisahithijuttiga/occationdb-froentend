import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/about" className="nav-link">📖 About</Link>
      </nav>
    </header>
  );
};

export default Header;
