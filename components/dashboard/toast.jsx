'use client'

export default function Toast({ message, type = 'info', onClose }) {
  const baseStyles = 'px-4 py-3 rounded-lg shadow-lg font-medium text-sm transition-opacity duration-200'

  const typeStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  }

  return (
    <div
      className={`${baseStyles} ${typeStyles[type] || typeStyles.info} pointer-events-auto`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold hover:opacity-80 transition-opacity"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}
