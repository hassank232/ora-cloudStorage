import FileList from '../components/FileList'

// Audio page - displays filtered view of user's audio files using shared FileList component
function Audio() {
  return (
    <FileList
      title="Audio"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      }
      mimeTypeFilter={(file) => file.mimeType.startsWith('audio/')}
      emptyStateMessage="No audio files found"
      emptyStateSubtext="Upload some MP3, WAV, or M4A files to get started"
    />
  )
}

export default Audio