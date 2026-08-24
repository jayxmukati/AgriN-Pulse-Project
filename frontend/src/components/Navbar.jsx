import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloudmark, MenuIcon } from './icons';
import './Navbar.css';
import { UserCircle, LogOut, User, Globe } from 'lucide-react';
import LoginModal from './LoginModal';

const LINKS = [
  { label: 'Overview', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'News', path: '/news' },
  { label: 'Diagnostic', path: '/diagnose' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Forum', path: '/forum' },
  { label: 'Analytics', path: '/analytics' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authDropdown, setAuthDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  
  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    setLangDropdown(false);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('agrin_token') : null;
  const isAuthenticated = !!token;

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
      <div className="nav__inner shell flex w-full justify-between items-center">
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

        <div className="nav__actions flex items-center gap-4 relative ml-auto justify-end">
          {/* Language Toggle */}
          <div className="relative hidden md:block">
            <button 
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs font-bold text-white border border-white/20"
            >
              <Globe className="w-4 h-4" />
              {currentLang}
            </button>
            
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-2xl overflow-hidden z-50 py-1">
                {['EN', 'HI', 'SW', 'PT'].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLang === lang ? 'bg-green-500/20 text-green-400 font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    {lang === 'EN' && 'English'}
                    {lang === 'HI' && 'हिंदी (HI)'}
                    {lang === 'SW' && 'Kiswahili'}
                    {lang === 'PT' && 'Português'}
                  </button>
                ))}
              </div>
            )}
          </div>
          {!isAuthenticated ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-[11px] font-bold bg-white/10 border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-colors cursor-pointer text-white"
            >
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setAuthDropdown(!authDropdown)}
                className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center cursor-pointer hover:bg-green-500/30 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              
              {authDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Signed In As</p>
                    <p className="text-sm font-bold text-white">Farmer Account</p>
                  </div>
                  <div className="p-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setAuthDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                    >
                      <UserCircle className="w-5 h-5" />
                      Your Profile
                    </Link>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('agrin_token');
                        setAuthDropdown(false);
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
          <Link to="/profile" onClick={closeMenu}>Your Profile</Link>
          <Link className="text-red-400" to="/" onClick={() => {
            localStorage.removeItem('agrin_token');
            closeMenu();
            window.location.href = "/";
          }}>Sign Out</Link>
        </div>
      )}

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={(token) => {
            setShowLoginModal(false);
            window.location.href = "/profile";
          }}
        />
      )}
    </header>
  );
}
