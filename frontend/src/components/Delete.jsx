// Modal for confirming file deletion - requires user confirmation before permanent deletion
function DeleteModal({ isOpen, onClose, file, onConfirm }) {
    const handleConfirm = () => {
      onConfirm(file.id)
      onClose()
    }
  
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black border border-gray-600 rounded-lg p-6 w-96 shadow-2xl">
          <h3 className="text-white text-lg mb-4 font-medium">Delete File</h3>
          <p className="text-white/70 mb-6">
            Are you sure you want to permanently delete "{file?.filename}"?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-white bg-white/10 hover:bg-white/20 rounded transition-colors border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded transition-colors border border-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default DeleteModal