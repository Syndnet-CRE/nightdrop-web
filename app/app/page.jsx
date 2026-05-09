'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardView from '@/components/dashboard/views/dashboard-view'
import MapView from '@/components/dashboard/views/map-view'
import BuyBoxesView from '@/components/dashboard/views/buy-boxes-view'
import SettingsView from '@/components/dashboard/views/settings-view'
import InviteView from '@/components/dashboard/views/invite-view'
import AdminView from '@/components/dashboard/views/admin-view'
import NightdropBar from '@/components/dashboard/nightdrop-bar'
import ConfigurationOverlay from '@/components/dashboard/configuration-overlay'

export default function AppPage() {
  const [view, setView] = useState('dashboard')
  const [showWizard, setShowWizard] = useState(false)
  const [editingBuyBox, setEditingBuyBox] = useState(null)
  const [pausingBuyBox, setPausingBuyBox] = useState(null)
  const [confirmDanger, setConfirmDanger] = useState(null)

  const router = useRouter()

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView />
      case 'map':
        return <MapView />
      case 'boxes':
        return <BuyBoxesView onEditBox={setEditingBuyBox} />
      case 'settings':
        return <SettingsView />
      case 'invites':
        return <InviteView />
      case 'admin':
        return <AdminView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      <NightdropBar
        view={view}
        onSetView={setView}
        onShowWizard={setShowWizard}
        onLogout={() => {
          localStorage.removeItem('nd_token')
          localStorage.removeItem('nightdrop-subscriber')
          router.push('/login')
        }}
      />
      <main className="flex-1 overflow-auto">{renderView()}</main>

      {(showWizard || editingBuyBox) && (
        <ConfigurationOverlay
          open={showWizard || !!editingBuyBox}
          onOpenChange={(open) => {
            if (!open) { setShowWizard(false); setEditingBuyBox(null) }
          }}
          mode={editingBuyBox ? 'edit' : 'create'}
          initialData={editingBuyBox}
        />
      )}
    </div>
  )
}
