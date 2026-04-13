import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:ml-16 lg:ml-64">
        <Header />
        <main className="mt-16 flex-1 overflow-y-auto bg-[#F5F7FA] p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
