import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SimpleNavbar from '../components/SimpleNavbar'

// Signup page - handles user registration and validates password requirements
function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const navigate = useNavigate()

  // Check if password meets all security requirements
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  }

  const isPasswordValid = Object.values(passwordRequirements).every(req => req)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Signup attempt initiated')
    setError('')

    // Validate password before sending to backend
    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      return
    }

    setIsLoading(true)
    
    try {
      // Send registration data to backend API
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          phoneNumber: formData.phoneNumber || null // Optional field
        })
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }
      
      console.log('Registration successful')
      
      // Clear form after successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        phoneNumber: ''
      })
      
      // Redirect to login with success message
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
      
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.message || 'Registration failed. Please try again.')
      // Form data persists on error - user doesn't have to retype everything
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20 md:pt-0 mt-4 md:mt-0">
      <SimpleNavbar />
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* left Side - Welcome Message */}
        <div className="bg-black rounded-2xl shadow-xl border border-gray-500 p-8 flex flex-col justify-center min-h-[530px]"
        style={{ boxShadow: '0 0 30px 25px rgba(0,0,255,0.5)' }}
        >
          <div className="text-center">
            
            {/* Welcome Message */}
            <div className="space-y-6">
              <h2 className="text-3xl font-light text-white">
                Welcome to Ora
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                The secure cloud storage platform designed for your digital life.
              </p>
              
              <p className="text-lg text-gray-400 leading-relaxed">
                Store, organize, and access all your files from anywhere. 
                With advanced encryption and seamless sharing, 
                your data stays safe while remaining easily accessible.
              </p>

              {/* Feature highlights */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center text-gray-300">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center justify-center text-gray-300">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                  <span>Instant file synchronization</span>
                </div>
                <div className="flex items-center justify-center text-gray-300">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19h6M15 3H9" />
                </svg>
                  <span>Cross-device availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        
        {/* right Side - Signup Form */}
        <div className="bg-black rounded-2xl shadow-xl border border-gray-500 p-8 mb-9 lg:mb-0">
          <h2 className="text-3xl font-light text-white mb-8">Create Account</h2>
          
          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  //placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  //placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                  className="w-full px-4 py-3 pr-12 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  //placeholder="Create a strong password"
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
              
              {/* Password requirements tooltip - shows while typing if invalid */}
              {(showPasswordRequirements && !isPasswordValid) && (
                <div className="absolute top-full left-0 mt-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-sm shadow-lg z-10 w-80">
                  <p className="text-gray-300 mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                      <span className="mr-2">{passwordRequirements.length ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      <span className="mr-2">{passwordRequirements.uppercase ? '✓' : '○'}</span>
                      One uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                      <span className="mr-2">{passwordRequirements.lowercase ? '✓' : '○'}</span>
                      One lowercase letter (a-z)
                    </li>
                    <li className={`flex items-center ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                      <span className="mr-2">{passwordRequirements.number ? '✓' : '○'}</span>
                      One number (0-9)
                    </li>
                    <li className={`flex items-center ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                      <span className="mr-2">{passwordRequirements.special ? '✓' : '○'}</span>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                //placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignupPage