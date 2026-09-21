import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PartnerManagementPage from './pages/PartnerManagementPage'
import SearchCustomerPage from './pages/SearchCustomerPage'
import { ToastProvider } from './components/ui/Toast'

const PAGES = {
  partners: PartnerManagementPage,
  customers: SearchCustomerPage,
}

function AppContent() {
  const [activePage, setActivePage] = useState('partners')
  const ActivePage = PAGES[activePage]

  return (
    <div
      className="flex h-screen w-full gap-4 overflow-hidden bg-surface-sunken p-4 text-ink"
      style={{ minWidth: 1280 }}
    >
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <ActivePage />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
