'use client'

import { useAuth } from '../providers/auth-provider'
import { useRouter } from 'next/navigation'

export default function NightdropBar({ view, onSetView, onShowWizard, onLogout }) {
  const { subscriber } = useAuth()
  const router = useRouter()
  const isAdmin = subscriber?.email === 'brady@parcyl.ai'

  const viewItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'boxes', label: 'Buy Boxes', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950">
      <div className="max-w-full px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600">⚡</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Nightdrop</span>
        </div>

        {/* Main nav items */}
        <div className="flex items-center gap-1">
          {viewItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSetView(item.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === item.id
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <span className="mr-2">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right side: User menu */}
        <div className="flex items-center gap-4">
          {/* New buy box button */}
          <button
            onClick={onShowWizard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            + New Box
          </button>

          {/* Avatar dropdown menu */}
          <div className="relative group">
            <button
              className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center font-bold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              title={subscriber?.email}
            >
              {subscriber?.email?.charAt(0).toUpperCase() || 'U'}
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{subscriber?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{subscriber?.email}</p>
              </div>

              {isAdmin && (
                <>
                  <button
                    onClick={() => onSetView('invites')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    📧 Manage Invites
                  </button>
                  <button
                    onClick={() => onSetView('admin')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🔧 Admin
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                </>
              )}

              <button
                onClick={() => router.push('/app/settings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ⚙️ Profile
              </button>

              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-700"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
