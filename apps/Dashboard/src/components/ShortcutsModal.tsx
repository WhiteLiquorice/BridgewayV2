import Modal from './Modal'

const SHORTCUTS = [
  { keys: 'Ctrl+K', mac: '⌘K', action: 'Open command palette' },
  { keys: 'N', mac: 'N', action: 'New appointment' },
  { keys: 'C', mac: 'C', action: 'Go to client search' },
  { keys: '?', mac: '?', action: 'Show this help' },
  { keys: 'Esc', mac: 'Esc', action: 'Close modal / palette' },
]

export default function ShortcutsModal({ isOpen, onClose }) {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="sm">
      <div className="space-y-1">
        {SHORTCUTS.map(s => (
          <div key={s.keys} className="flex items-center justify-between py-2.5 px-1">
            <span className="text-sm text-gray-300">{s.action}</span>
            <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono font-medium text-gray-400 bg-gray-800 rounded border border-gray-700">
              {isMac ? s.mac : s.keys}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  )
}
