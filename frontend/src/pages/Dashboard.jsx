import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Dashboard - main hub showing user profile, file categories, and upload functionality
function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [username, setUsername] = useState('') 
  const [userId, setUserId] = useState(null)   // Database ID for file ownership
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [files, setFiles] = useState([])       // All user's files from backend
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  // Check authentication and fetch user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      const email = localStorage.getItem('userEmail')
      
      if (!token || !email) {
        navigate('/login')
        return
      }
      
      try {
        // Get user details from backend to get database ID and username
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const user = await response.json()
          setUserEmail(email)
          setUserId(user.id) // Database ID needed for file ownership
          setUsername(user.username) 

          setLoading(false)
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/login')
      }
    }
    
    checkAuth()
  }, [navigate])

  // Fetch all files owned by this user
  useEffect(() => {
    const fetchFiles = async () => {
      if (!userId) return
      
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`http://localhost:8080/api/files/owner/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const userFiles = await response.json()
          setFiles(userFiles)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
  
    fetchFiles()
  }, [userId])

  // Refresh file list after upload
  const refreshFiles = async () => {
    if (!userId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/api/files/owner/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const userFiles = await response.json()
        setFiles(userFiles)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  // Calculate file counts by category based on MIME types
  const getFileCounts = () => {
    const documents = files.filter(f => f.mimeType.startsWith('application/') || f.mimeType.startsWith('text/')).length
    const images = files.filter(f => f.mimeType.startsWith('image/')).length  
    const videos = files.filter(f => f.mimeType.startsWith('video/')).length
    const audio = files.filter(f => f.mimeType.startsWith('audio/')).length
    
    return { documents, images, videos, audio }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('username') 
    navigate('/login')
  }

  // Upload files to backend
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0 || !userId) return

    setUploading(true)
    setUploadMessage('')

    try {
      const token = localStorage.getItem('authToken')
      
      // Upload each file individually with owner ID
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('ownerId', userId.toString())
        
        const response = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      setUploadMessage(`Successfully uploaded ${files.length} file(s)!`)
      refreshFiles() // Refresh file counts
      
      // Clear message after 3 seconds
      setTimeout(() => setUploadMessage(''), 3000)
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadMessage('Upload failed. Please try again.')
      setTimeout(() => setUploadMessage(''), 3000)
    } finally {
      setUploading(false)
    }
  }

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    handleFileUpload(files)
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  // Navigate to category-specific file view
  const handleCategoryClick = (category) => {
    navigate(`/dashboard/${category}`)
  }

  if (loading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const counts = getFileCounts()

  return (
    <div className="min-h-screen bg-black">
      <Navbar userEmail={userEmail} username={username} onLogout={handleLogout} />
      
      <div className="pt-16 min-h-screen overflow-y-auto">
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">

            {/* Main Top Cards - Desktop: Side by side, Mobile: Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* User Profile Card */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/20 shadow-xl"
              style={{ boxShadow: '0 0 8px 2px rgba(0,255,0,1.0)' }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {username || userEmail.split('@')[0]}
                  </h2>
                  <p className="text-white/50 text-sm mb-4">{userEmail}</p>
                  
                  {/* Glowing Circles Logo - Small Version */}
                  <div className="flex justify-center items-center space-x-11 mt-7">
                    
                    {/* O circle */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-blue-600 blur-lg opacity-40 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-blue-600 blur-md opacity-60"></div>
                      <div className="relative w-full h-full rounded-full border-2 border-blue-600 flex items-center justify-center bg-transparent"
                           style={{ boxShadow: '0 0 10px 10px rgba(0,0,255,0.7)' }}>
                          <span className="text-sm font-bold text-white">O</span>
                      </div>
                    </div>

                    {/* R circle */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-red-600 blur-lg opacity-40 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-red-600 blur-md opacity-60"></div>
                      <div className="relative w-full h-full rounded-full border-2 border-red-600 flex items-center justify-center bg-transparent"
                           style={{ boxShadow: '0 0 10px 4px rgba(255,0,0,0.7)' }}>
                          <span className="text-sm font-bold text-white">R</span>
                      </div>
                    </div>

                    {/* A circle */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-green-600 blur-lg opacity-40 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-green-600 blur-md opacity-60"></div>
                      <div className="relative w-full h-full rounded-full border-2 border-green-600 flex items-center justify-center bg-transparent"
                           style={{ boxShadow: '0 0 10px 2px rgba(0,255,0,0.7)' }}>
                          <span className="text-sm font-bold text-white">A</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* File Upload Card - with drag-and-drop */}
              <div 
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:bg-white/10 transition-all group"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {uploading ? (
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Upload Files</h3>
                  <p className="text-white/70 text-sm mb-6">
                    {uploading ? 'Uploading...' : 'Drag and drop or click to upload'}
                  </p>
                  
                  {/* Upload Message */}
                  {uploadMessage && (
                    <div className={`mb-4 p-2 rounded text-sm ${
                      uploadMessage.includes('Success') 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {uploadMessage}
                    </div>
                  )}
                  
                  <button 
                    onClick={handleChooseFiles}
                    disabled={uploading}
                    className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-6 py-3 rounded-lg transition-all border border-white/30 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

            </div>

            {/* Category Cards Grid - clickable navigation to filtered views */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

              {/* Documents Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => handleCategoryClick('documents')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Documents</h3>
                      <p className="text-white/70 text-sm">{counts.documents} files</p>
                    </div>
                  </div>
                  <div className="text-2xl text-white/50 group-hover:text-white/70 transition-colors">→</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">PDF, Word, Excel files</div>
                </div>
              </div>

              {/* Images Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => handleCategoryClick('images')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Images</h3>
                      <p className="text-white/70 text-sm">{counts.images} photos</p>
                    </div>
                  </div>
                  <div className="text-2xl text-white/50 group-hover:text-white/70 transition-colors">→</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">JPG, PNG, GIF files</div>
                </div>
              </div>

              {/* Videos Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => handleCategoryClick('videos')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Videos</h3>
                      <p className="text-white/70 text-sm">{counts.videos} videos</p>
                    </div>
                  </div>
                  <div className="text-2xl text-white/50 group-hover:text-white/70 transition-colors">→</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">MP4, MOV, AVI files</div>
                </div>
              </div>

              {/* Audio Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => handleCategoryClick('audio')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Audio</h3>
                      <p className="text-white/70 text-sm">{counts.audio} tracks</p>
                    </div>
                  </div>
                  <div className="text-2xl text-white/50 group-hover:text-white/70 transition-colors">→</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">MP3, WAV, M4A files</div>
                </div>
              </div>

              {/* All Files Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => handleCategoryClick('all-files')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">All Files</h3>
                      <p className="text-white/70 text-sm">Browse all uploads</p>
                    </div>
                  </div>
                  <div className="text-2xl text-white/50 group-hover:text-white/70 transition-colors">→</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">View and manage all your files</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage