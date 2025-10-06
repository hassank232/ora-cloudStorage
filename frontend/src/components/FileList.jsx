import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import RenameModal from './Rename'
import DeleteModal from './Delete'
import PreviewModal from './Preview'

// Shared component for displaying filtered file lists across different category pages
// Accepts filter function to show specific file types (images, videos, etc.) or all files
function FileList({ 
  title, 
  icon, 
  mimeTypeFilter, 
  emptyStateMessage, 
  emptyStateSubtext 
}) {
  const [userEmail, setUserEmail] = useState('')
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState(null)
  const [files, setFiles] = useState([])
  const [showDropdown, setShowDropdown] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [modalType, setModalType] = useState(null)  // 'rename' or 'delete'
  const [previewFile, setPreviewFile] = useState(null)
  
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null)
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      const email = localStorage.getItem('userEmail')
      
      if (!token || !email) {
        navigate('/login')
        return
      }
      
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const user = await response.json()
          setUserEmail(email)
          setUserId(user.id)
          setUsername(user.username)
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

  // Fetch and filter files based on the MIME type filter passed from parent
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
          // Apply category filter (e.g., only images, only videos, or all)
          const filteredFiles = mimeTypeFilter 
            ? userFiles.filter(mimeTypeFilter)
            : userFiles
          setFiles(filteredFiles)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
  
    fetchFiles()
  }, [userId, mimeTypeFilter])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Request download URL from backend and trigger browser download
  const handleDownload = async (fileId) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/api/files/${fileId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const { downloadUrl, filename } = await response.json()
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        link.click()
      }
    } catch (error) {
      console.error('Download error:', error)
    }
    setShowDropdown(null)
  }

  const handleRename = (file) => {
    setSelectedFile(file)
    setModalType('rename')
    setShowDropdown(null)
  }
  
  const handleDelete = (file) => {
    setSelectedFile(file)
    setModalType('delete')
    setShowDropdown(null)
  }

  // Get temporary view URL for file preview
  const handlePreview = async (file) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/api/files/${file.id}/view`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const { viewUrl } = await response.json()
        return viewUrl
      }
    } catch (error) {
      console.error('Preview error:', error)
    }
    return null
  }

  // Rename file name in backend and refresh file list
  const confirmRename = async (fileId, newFilename) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/api/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: newFilename })
      })
      
      if (response.ok) {
        // Refresh file list with updated data
        const userFiles = await fetch(`http://localhost:8080/api/files/owner/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json())
        
        const filteredFiles = mimeTypeFilter 
          ? userFiles.filter(mimeTypeFilter)
          : userFiles
        setFiles(filteredFiles)
      }
    } catch (error) {
      console.error('Rename error:', error)
    }
  }
  
  // Delete file from backend and remove from local state
  const confirmDelete = async (fileId) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8080/api/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const getFileTypeLabel = (file) => {
    return file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'
  }

  const getFileCountLabel = () => {
    if (title === 'Images') return `${files.length} photos`
    if (title === 'Videos') return `${files.length} videos`
    if (title === 'Audio') return `${files.length} tracks`
    if (title === 'Documents') return `${files.length} files`
    return `${files.length} files`
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar userEmail={userEmail} username={username} onLogout={handleLogout} />
      
      <div className="pt-16 min-h-screen overflow-y-auto">
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  {icon}
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-white">{title}</h1>
                  <p className="text-white/70">{getFileCountLabel()}</p>
                </div>
              </div>
            </div>

            {/* Files List or empty state */}
            <div className="bg-black backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              {files.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {icon}
                  </div>
                  <p className="text-white/70">{emptyStateMessage}</p>
                  <p className="text-white/50 text-sm mt-2">{emptyStateSubtext}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {files.map((file) => (
                    <div key={file.id} className="p-4 hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                              <button 
                                onClick={() => setPreviewFile(file)}
                                className="text-white font-medium truncate flex-1 text-left hover:text-blue-600"
                              >
                                {file.filename}
                              </button>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60 sm:flex-nowrap">
                                <p className="uppercase tracking-wider">
                                  {getFileTypeLabel(file)}
                                </p>
                                <p>
                                  {formatFileSize(file.fileSize)}
                                </p>
                                <p>
                                  {formatDate(file.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Three-dot menu */}
                        <div className="relative ml-4 self-start sm:self-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDropdown(showDropdown === file.id ? null : file.id)
                            }}
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          {showDropdown === file.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-black border border-gray-600 rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => handleDownload(file.id)}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 rounded-t-lg flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </button>
                              <button
                                onClick={() => handleRename(file)}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Rename
                              </button>
                              <button
                                onClick={() => handleDelete(file)}
                                className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-800 hover:text-white rounded-b-lg transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals for file operations */}
      
      <RenameModal 
        isOpen={modalType === 'rename'}
        onClose={() => setModalType(null)}
        file={selectedFile}
        onConfirm={confirmRename}
      />

      <DeleteModal 
        isOpen={modalType === 'delete'}
        onClose={() => setModalType(null)}
        file={selectedFile}
        onConfirm={confirmDelete}
      />

      <PreviewModal 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        onPreview={handlePreview}
      />
    </div>
  )
}

export default FileList