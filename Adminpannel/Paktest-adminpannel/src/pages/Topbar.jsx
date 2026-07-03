import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBriefcase, FaBook, FaCheckCircle,
  FaTags, FaBars, FaTimes, FaChevronDown, FaSignOutAlt, FaPowerOff,
  FaTag, FaClipboardList, FaFileAlt, FaTasks, FaCalendarCheck
} from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { MdOutlineLayers } from 'react-icons/md';
import '../styles/Topbar.css';

const navLinks = [
  { to: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/test-conduct-bodies', icon: <FaTags />, label: 'Test Bodies' },
  { to: '/admin/positions', icon: <FaBriefcase />, label: 'Positions' },
  { to: '/admin/subjects', icon: <FaTag />, label: 'Subjects' },
  { to: '/admin/books', icon: <GiBookshelf />, label: 'Books' },
  { to: '/admin/chapters', icon: <MdOutlineLayers />, label: 'Chapters' },
  { to: '/admin/mcqs', icon: <FaCheckCircle />, label: 'MCQs' },
  { to: '/admin/patterns', icon: <FaTasks />, label: 'Patterns' },
  { to: '/admin/papers', icon: <FaFileAlt />, label: 'Papers' },
  { to: '/admin/jobs', icon: <FaClipboardList />, label: 'Jobs' },
];

const Topbar = ({ onLogout, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const profileMenuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('userName');
    setCurrentUserName(userName || saved || 'Admin');
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current && !profileMenuRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    ['userName', 'userData', 'token', 'isLoggedIn'].forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    setCurrentUserName('Admin');
    setProfileMenuOpen(false);
    if (onLogout) onLogout();
    navigate('/login');
  };

  const isActive = (to) => {
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo-container">
          <span style={{ fontSize: '1.6rem' }}>📚</span>
        </div>
        <span className="topbar-title">Exam<span>Prep</span> Admin</span>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`topbar-menu ${menuOpen ? 'show' : ''}`}>
        {navLinks.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`menu-item ${isActive(to) ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="menu-icon">{icon}</span>
            <span>{label}</span>
            <div className="active-indicator" />
          </Link>
        ))}
      </div>

      <div className="topbar-right">
        <div className="profile-menu-container" ref={profileMenuRef}>
          <div className="user-profile" onClick={() => setProfileMenuOpen(!profileMenuOpen)} ref={profileRef}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=6366f1&color=fff&size=40`}
              alt="User"
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">{currentUserName}</div>
              <small className="user-role">Super Admin</small>
            </div>
            <div className="profile-menu-arrow">
              <FaChevronDown className={`profile-arrow ${profileMenuOpen ? 'open' : ''}`} />
            </div>
          </div>

          {profileMenuOpen && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=6366f1&color=fff&size=50`}
                  alt="User"
                  className="profile-menu-avatar"
                />
                <div className="profile-menu-info">
                  <div className="profile-menu-name">{currentUserName}</div>
                  <div className="profile-menu-email">admin@examprep.com</div>
                </div>
              </div>
              <div className="profile-menu-divider" />
              <button className="profile-menu-item logout" onClick={handleLogout}>
                <FaSignOutAlt className="profile-menu-icon" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        <button className="logout-btn mobile-logout" onClick={handleLogout} title="Logout">
          <FaPowerOff />
        </button>
      </div>
    </div>
  );
};

export default Topbar;