import FileList from '../components/FileList'

// Documents page - displays filtered view of user's document files using shared FileList component
function Documents() {
  return (
    <FileList
      title="Documents"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      mimeTypeFilter={(file) => file.mimeType.startsWith('application/') || file.mimeType.startsWith('text/')}
      emptyStateMessage="No documents found"
      emptyStateSubtext="Upload some PDF, Word, or Excel files to get started"
    />
  )
}

export default Documents