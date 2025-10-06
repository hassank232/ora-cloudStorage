import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Navigation bar for authenticated users - shows logo and profile dropdown with logout
const Navbar = ({ userEmail, username, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  const handleSignOut = () => {
    setIsDropdownOpen(false)
    onLogout()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section - Left Side */}
          <div 
            className="flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={handleLogoClick}
          >
            {/* ORA Logo - Smaller version for navbar */}
            <div className="flex items-center space-x-1">
              {/* O circle */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-blue-600 blur-sm opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border border-blue-600 blur-xs opacity-60"></div>
                <div className="relative w-full h-full rounded-full border border-blue-600 flex items-center justify-center bg-transparent"
                     style={{ boxShadow: '0 0 6px 8px rgba(0,0,255,0.5)' }}>
                  <span className="text-xs font-bold text-white">O</span>
                </div>
              </div>

              {/* R circle */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-red-600 blur-sm opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border border-red-600 blur-xs opacity-60"></div>
                <div className="relative w-full h-full rounded-full border border-red-600 flex items-center justify-center bg-transparent"
                     style={{ boxShadow: '0 0 6px 4px rgba(255,0,0,0.5)' }}>
                  <span className="text-xs font-bold text-white">R</span>
                </div>
              </div>

              {/* A circle */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-green-600 blur-sm opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border border-green-600 blur-xs opacity-60"></div>
                <div className="relative w-full h-full rounded-full border border-green-600 flex items-center justify-center bg-transparent"
                     style={{ boxShadow: '0 0 6px 3px rgba(0,255,0,0.5)' }}>
                  <span className="text-xs font-bold text-white">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section - Right Side */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              {/* User Profile Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  {/* Username - normal size */}
                  <div className="text-white font-medium text-sm">
                  {username || userEmail?.split('@')[0] || 'User'}
                  </div>
                  {/* Email - smaller and gray */}
                  <div className="text-gray-400 text-xs mt-1">
                    {userEmail}
                  </div>
                </div>
                <div className="p-2">
                  {/* Sign Out Button - red text */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-700 hover:text-white rounded-lg text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar