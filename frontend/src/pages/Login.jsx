import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import SimpleNavbar from '../components/SimpleNavbar'

// Login page - handles user authentication and redirects to dashboard on success
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')
  const location = useLocation()

  // Display success message if redirected from signup page
  useEffect(() => {
    // Check if we have a success message from signup
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
      
      // Clear the location state so message doesn't persist on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login attempt initiated',) 
    setError('')
    setIsLoading(true)
    
    try {
      // Send login credentials to backend API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      
      console.log('Response status:', response.status) 
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      const data = await response.json()
      console.log('Login successful, token received') 
      
      // Store auth token and email in browser for authenticated requests
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userEmail', email)
      
      // Redirect to dashboard after successful login
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-28 md:pt-0 mt-4 md:mt-0">
      <SimpleNavbar />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-28 lg:gap-20 items-center">
        
        {/* Left Side - Welcome Back Message */}
        <div className="bg-black rounded-2xl shadow-xl border border-gray-500 p-8 flex flex-col justify-center min-h-[430px]"
        style={{ boxShadow: '0 0 50px 0px rgba(255,0,0,1.0)' }}
        >
          <div className="text-center">
            {/* ORA Logo */}
            <div className="mb-8">
              {/* Glowing Circles Logo */}
              <div className="flex justify-center items-center space-x-4 mb-4">
                
                {/* O circle */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-600 blur-lg opacity-40 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-600 blur-md opacity-60"></div>
                  <div className="relative w-full h-full rounded-full border-2 border-blue-600 flex items-center justify-center bg-transparent"
                       style={{ boxShadow: '0 0 20px 8px rgba(0,0,255,0.7)' }}>
                      <span className="text-2xl font-bold text-white">O</span>
                  </div>
                </div>

                {/* R circle */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-red-600 blur-lg opacity-40 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-red-600 blur-md opacity-60"></div>
                  <div className="relative w-full h-full rounded-full border-2 border-red-600 flex items-center justify-center bg-transparent"
                       style={{ boxShadow: '0 0 20px 6px rgba(255,0,0,0.7)' }}>
                      <span className="text-2xl font-bold text-white">R</span>
                  </div>
                </div>

                {/* A circle */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-green-600 blur-lg opacity-40 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-green-600 blur-md opacity-60"></div>
                  <div className="relative w-full h-full rounded-full border-2 border-green-600 flex items-center justify-center bg-transparent"
                       style={{ boxShadow: '0 0 20px 4px rgba(0,255,0,0.7)' }}>
                      <span className="text-2xl font-bold text-white">A</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Welcome Back Message */}
            <div className="space-y-6">
              <h2 className="text-3xl font-light text-white">
                Welcome Back!
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Sign in to access your secure cloud storage.
              </p>

            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-black rounded-2xl shadow-xl border border-gray-500 p-8 mb-24 lg:mb-0">
          <h2 className="text-3xl font-light text-white mb-8">Log in</h2>
          
          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Success message from signup redirect */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-900 border border-green-600 rounded-lg">
              <p className="text-sm text-green-200">{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                //placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  //placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage