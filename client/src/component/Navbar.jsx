import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  if (token && userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      user = null;
    }
  }

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
  
      <header className="flex sticky top-0  z-100 justify-between items-center px-6 py-4 md:px-12 md:py-3 border-b backdrop-blur-xl border-white/[0.03]">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            nexus<span className="text-white/50 font-normal">+</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-sm text-white/60">
          <Link to="/" className="hover:text-white transition-colors">
            Discover Events
          </Link>

          {/* Create Event button for Organizer/Admin */}
          {user && (user.role === 'organizer' || user.role === 'admin' || localStorage.getItem('role') === 'organizer') && (
            <Link
              to="/createevent"
              className="bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.08] rounded-full px-4 py-1.5 font-medium transition-all text-xs"
            >
              Create Event
            </Link>
          )}

          {/* Auth Button or User Avatar Dropdown */}
          {!token ? (
            <Link
              to={location.pathname === '/signup' ? '/login' : '/signup'}
              className="bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.08] rounded-full px-4 py-1.5 font-medium transition-all text-xs"
            >
              {location.pathname === '/signup' ? 'Sign In' : 'Sign Up'}
            </Link>
          ) : (
            user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full pl-2 pr-3 py-1 cursor-pointer transition-all duration-200 focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-[#f2ca77] text-black font-bold flex items-center justify-center text-xs shadow-[0_0_8px_rgba(242,202,119,0.15)]">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-white/80 font-medium hidden sm:inline truncate max-w-[80px]">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-[#181a1d] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-2xl p-2 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Profile Header */}
                    <div className="px-3.5 py-2.5 border-b border-white/[0.04] mb-1.5">
                      <div className="text-xs font-semibold text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-white/40 truncate mt-0.5">
                        {user.email}
                      </div>
                      <div className="inline-block bg-[#f2ca77]/10 text-[#f2ca77] border border-[#f2ca77]/20 text-[9px] font-bold px-1.5 py-0.5 rounded mt-1.5 uppercase tracking-wide">
                        {user.role || 'Attendee'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <User className="w-4 h-4 text-white/30" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to={
                        user.role === 'organizer' || user.role === 'admin'
                          ? '/my-events'
                          : '/my-bookings'
                      }
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-white/30" />
                      <span>
                        {user.role === 'organizer' || user.role === 'admin'
                          ? 'My Events'
                          : 'My Bookings'}
                      </span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-white/30" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="h-[1px] bg-white/[0.04] my-1.5"></div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-400/55" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </header>
  
  );
}

export default Navbar;
