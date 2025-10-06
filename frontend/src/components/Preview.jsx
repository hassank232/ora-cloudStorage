import { useState, useEffect } from 'react'

// Modal for previewing files - fetches temporary view URL and displays based on file type
function PreviewModal({ isOpen, onClose, file, onPreview }) {
  if (!isOpen || !file) return null

  return (
    <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-4xl max-h-[90vh] w-full m-4 bg-black border border-gray-600 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h3 className="text-white text-lg font-medium truncate">
            {file.filename}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Preview Content */}
        <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
          <PreviewContent file={file} onPreview={onPreview} />
        </div>
      </div>
    </div>
  )
}

// Handles file preview logic - fetches URL from backend and renders based on MIME type
function PreviewContent({ file, onPreview }) {
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(true)
  
    // Fetch temporary preview URL from backend
    useEffect(() => {
      const loadPreview = async () => {
        const url = await onPreview(file)
        setPreviewUrl(url)
        setLoading(false)
      }
      loadPreview()
    }, [file, onPreview])
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }
  
    if (!previewUrl) {
      return (
        <div className="text-center text-white/70 py-16">
          Unable to load preview
        </div>
      )
    }
  
    // Images - display directly in modal (inline)
    if (file.mimeType.startsWith('image/')) {
      return (
        <img 
          src={previewUrl} 
          alt={file.filename}
          className="max-w-full max-h-full object-contain mx-auto"
        />
      )
    }
  
    // Videos - open in new tab for better compatibility
    if (file.mimeType.startsWith('video/')) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg mb-4 text-white">{file.filename}</p>
          <p className="text-sm mb-6 text-white/70">Video files open in a new tab for the best viewing experience</p>
          <button
            onClick={() => window.open(previewUrl, '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Open Video
          </button>
        </div>
      )
    }
  
    // Audio - open in new tab for better compatibility
    if (file.mimeType.startsWith('audio/')) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-lg mb-4 text-white">{file.filename}</p>
          <p className="text-sm mb-6 text-white/70">Audio files open in a new tab for the best playback experience</p>
          <button
            onClick={() => window.open(previewUrl, '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Open Audio
          </button>
        </div>
      )
    }
  
    // PDFs - open in new tab (most reliable)
    if (file.mimeType === 'application/pdf') {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg mb-4 text-white">{file.filename}</p>
        <p className="text-sm mb-6 text-white/70">PDF files open in a new tab for the best viewing experience</p>
        <button
          onClick={() => window.open(previewUrl, '_blank')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Open PDF
        </button>
      </div>
      )
    }
  
    // Text files - open in new tab for better readability
    if (file.mimeType.startsWith('text/')) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg mb-4 text-white">{file.filename}</p>
        <p className="text-sm mb-6 text-white/70">Text files open in a new tab for better readability</p>
        <button
          onClick={() => window.open(previewUrl, '_blank')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Open Text File
        </button>
      </div>
      )
    }
  
    // Fallback for Unsupported file types
    return (
      <div className="text-center text-white/70 py-16">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg mb-2">Preview not available</p>
        <p className="text-sm">File type: {file.mimeType}</p>
      </div>
    )
  }

export default PreviewModal