import { useNavigate } from 'react-router-dom'

// Navigation bar for unauthenticated pages (login/signup) - logo only, no profile section
const SimpleNavbar = () => {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/') // Takes user to home/landing page
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start items-center h-16">
          
          {/* Logo Section - Only the logo, no profile */}
          <div 
            className="flex items-center cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={handleLogoClick}
          >
            {/* ORA Logo */}
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

          {/* Empty space on the right - no profile section */}
        </div>
      </div>
    </nav>
  )
}

export default SimpleNavbar