import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="h-full bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Horizontal Glowing Circles */}
        <div className="flex flex-wrap justify-center items-center space-x-7 md:space-x-20 mb-11">

          {/* First circle */}
          <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-blue-600 blur-xl md:blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-blue-600 blur-lg md:blur-2xl opacity-60"></div>
            <div className="relative w-full h-full rounded-full border-2 md:border-4 border-blue-600 flex items-center justify-center bg-transparent"
                 style={{ boxShadow: '0 0 40px 18px rgba(0,0,255,0.7)' }}>
                <span className="text-3xl md:text-5xl font-bold text-white">O</span>
            </div>
          </div>

          {/* Second circle */} 
          <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-red-600 blur-xl md:blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-red-600 blur-lg md:blur-2xl opacity-60"></div>
            <div className="relative w-full h-full rounded-full border-2 md:border-4 border-red-600 flex items-center justify-center bg-transparent"
                 style={{ boxShadow: '0 0 40px 8px rgba(255,0,0,0.7)' }}>
                <span className="text-3xl md:text-5xl font-bold text-white">R</span>
            </div>
          </div>

          {/* Third circle */}
          <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-green-600 blur-xl md:blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 md:border-4 border-green-600 blur-lg md:blur-2xl opacity-60"></div>
            <div className="relative w-full h-full rounded-full border-2 md:border-4 border-green-600 flex items-center justify-center bg-transparent"
                 style={{ boxShadow: '0 0 40px 6px rgba(0,255,0,0.7)' }}>
                <span className="text-3xl md:text-5xl font-bold text-white">A</span>
            </div>
          </div>

        </div>




        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-500 font-light">
          The cloud that stays with you
        </p>

        {/* Sign In Button */}
        <div className="pt-4">
        <Link 
          to="/login"
          className="hover:bg-gray-300 text-white hover:text-black font-medium text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4 rounded-full border-2 border-red-600"
        >
          Sign In
        </Link>
        </div>

        {/* Optional: Sign Up Link */}
        <div className="pt-4">
        <p className="text-xs sm:text-sm md:text-base text-gray-500">
            New to Ora?{' '}
            <Link 
            to="/signup" 
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
            Create an account
            </Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export default Home