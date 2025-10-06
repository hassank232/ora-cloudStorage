import { useState } from 'react'

// Modal for renaming files - preserves original file extension automatically
function RenameModal({ isOpen, onClose, file, onConfirm }) {
  const [input, setInput] = useState(file?.filename || '')

  const handleConfirm = () => {
    if (!input || input === file.filename) {
      onClose()
      return
    }
    
    // Preserve original file extension to prevent format issues
    const originalExt = file.filename.includes('.') ? 
    '.' + file.filename.split('.').pop() : ''

    // Remove extension from user input if they added one
    const nameWithoutExt = input.includes('.') ? 
    input.substring(0, input.lastIndexOf('.')) : input

    // Combine new name with original extension
    const finalName = nameWithoutExt + originalExt

    onConfirm(file.id, finalName)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-gray-600 rounded-lg p-6 w-96 shadow-2xl">
        <h3 className="text-white text-lg mb-4 font-medium">Rename File</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 bg-white/10 border border-gray-600 rounded text-white mb-6 focus:outline-none focus:border-white/40"
          placeholder="Enter new filename"
          autoFocus
        />
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-white bg-white/10 hover:bg-white/20 rounded transition-colors border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded border border-gray-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default RenameModal