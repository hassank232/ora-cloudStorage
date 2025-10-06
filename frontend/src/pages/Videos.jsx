import FileList from '../components/FileList'

// Videos page - displays filtered view of user's video files using shared FileList component
function Videos() {
  return (
    <FileList
      title="Videos"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      }
      mimeTypeFilter={(file) => file.mimeType.startsWith('video/')}
      emptyStateMessage="No videos found"
      emptyStateSubtext="Upload some MP4, MOV, or AVI files to get started"
    />
  )
}

export default Videos