import FileList from '../components/FileList'

// Images page - displays filtered view of user's image files using shared FileList component
function Images() {
  return (
    <FileList
      title="Images"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      mimeTypeFilter={(file) => file.mimeType.startsWith('image/')}
      emptyStateMessage="No images found"
      emptyStateSubtext="Upload some JPG, PNG, or GIF files to get started"
    />
  )
}

export default Images