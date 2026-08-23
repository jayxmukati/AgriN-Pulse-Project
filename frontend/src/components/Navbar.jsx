import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloudmark, MenuIcon } from './icons';
import './Navbar.css';

const LINKS = [
  { label: 'Overview', path: '/' },
  { label: 'Diagnostic', path: '/diagnose' },
  { label: 'Dashboard', path: '/dashboard' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner shell">
        <Link className="nav__brand" to="/" onClick={closeMenu}>
          <Cloudmark />
          <span>AgriN-Pulse</span>
        </Link>

        <nav className="nav__rail" aria-label="Primary">
          {LINKS.map(link => (
            <Link 
              key={link.label}
              to={link.path}
              className={location.pathname === link.path ? 'is-active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <Link className="nav__register" to="/">Sync Node</Link>
          <Link className="btn btn--ink" to="/">Export Data</Link>
        </div>

        <button 
          className="nav__toggle" 
          aria-expanded={open} 
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          {LINKS.map(link => (
            <Link 
              key={link.label} 
              to={link.path} 
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/" onClick={closeMenu}>Sync Node</Link>
          <Link className="btn btn--pearl" to="/" onClick={closeMenu}>Export Data</Link>
        </div>
      )}
    </header>
  );
}
