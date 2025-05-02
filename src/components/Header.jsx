import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from './ThemeProvider';
import { FiActivity } from 'react-icons/fi'; 
import "../styles/Header.css"

function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className="header">
      <div className="header-content container">
      <Link href="/" className="logo">
        <FiActivity className="logo-icon" />
        <span className="logo-text">NewsPulse</span>
      </Link>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {[
            { path: '/', label: 'Home' },
            { path: '/categories', label: 'Categories' },
            { path: '/search', label: 'Search' },
            { path: '/saved', label: 'Saved' }
          ].map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={location === path ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
        <button className="theme-toggle mobile-menu" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </header>
  );
}
export default Header;