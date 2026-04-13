import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  CalendarDays,
  Link as LinkIcon,
  ArrowUpFromLine,
  Users,
  FileText,
  UserCircle,
  Key,
  Shield,
  QrCode,
  Cpu,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { logout as logoutApi } from '../../api/auth.api'

const navClass =
  'mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-white/80 transition-all hover:bg-white/10 hover:text-white'
const activeClass = 'bg-white/15 font-medium text-white'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-white/50">
      {children}
    </p>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch {
      /* ignore */
    }
    clearAuth()
    navigate('/login', { replace: true })
    setMobileOpen(false)
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `${navClass} ${isActive ? activeClass : ''}`

  const body = (
    <>
      <div className="border-b border-white/10 px-4 py-6">
        <div className="flex items-center gap-2 text-white">
          <img src="/logo.png" alt="SafulPay logo" className="h-7 w-7 shrink-0 rounded object-contain" />
          <span className="text-xl font-bold">SafulPay</span>
        </div>
        <p className="mt-2 text-sm text-white/90">TECH&apos;N GOODWIL LTD</p>
      </div>

      <nav className="flex-1 overflow-y-auto pb-8">
        <SectionLabel>Main</SectionLabel>
        <NavLink to="/dashboard" className={linkCls} onClick={() => setMobileOpen(false)}>
          <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className={linkCls} onClick={() => setMobileOpen(false)}>
          <ArrowLeftRight className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Transactions</span>
        </NavLink>

        <SectionLabel>Merchant Services</SectionLabel>
        <NavLink to="/events" className={linkCls} onClick={() => setMobileOpen(false)}>
          <CalendarDays className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Events &amp; Tickets</span>
        </NavLink>
        <NavLink to="/payment-links" className={linkCls} onClick={() => setMobileOpen(false)}>
          <LinkIcon className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Payment Links</span>
        </NavLink>
        <NavLink to="/single-payment" className={linkCls} onClick={() => setMobileOpen(false)}>
          <ArrowUpFromLine className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Single Payment</span>
        </NavLink>
        <NavLink to="/bulk-payments" className={linkCls} onClick={() => setMobileOpen(false)}>
          <Users className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Bulk Payments</span>
        </NavLink>

        <SectionLabel>Reports</SectionLabel>
        <NavLink
          to="/reports/account-statement"
          className={linkCls}
          onClick={() => setMobileOpen(false)}
        >
          <FileText className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Account Statement</span>
        </NavLink>

        <SectionLabel>Settings</SectionLabel>
        <NavLink to="/settings/profile" className={linkCls} onClick={() => setMobileOpen(false)}>
          <UserCircle className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Profile Setting</span>
        </NavLink>
        <NavLink to="/settings/pin" className={linkCls} onClick={() => setMobileOpen(false)}>
          <Key className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Pin Setting</span>
        </NavLink>
        <NavLink to="/settings/2fa" className={linkCls} onClick={() => setMobileOpen(false)}>
          <Shield className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">2FA Security</span>
        </NavLink>
        <NavLink to="/settings/qr-code" className={linkCls} onClick={() => setMobileOpen(false)}>
          <QrCode className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">My QRcode</span>
        </NavLink>
        <NavLink to="/settings/api-key" className={linkCls} onClick={() => setMobileOpen(false)}>
          <Cpu className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate">Api Key</span>
        </NavLink>

        <div className="mt-6 px-2">
          <button
            type="button"
            onClick={handleLogout}
            className={`${navClass} w-[calc(100%-1rem)] border border-white/20`}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white shadow md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col overflow-hidden bg-brand lg:flex">
        {body}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 max-w-[85vw] flex-col overflow-hidden bg-brand shadow-xl">
            <button
              type="button"
              className="absolute right-2 top-2 rounded-lg p-2 text-white/80 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {body}
          </aside>
        </div>
      ) : null}

      {/* Tablet: narrower icon rail (labels hidden) */}
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-16 flex-col items-center gap-1 bg-brand py-4 md:flex lg:hidden">
        <img src="/logo.png" alt="SafulPay logo" className="mb-4 h-6 w-6 rounded object-contain" />
        <NavLink
          to="/dashboard"
          title="Dashboard"
          className={({ isActive }) =>
            `rounded-lg p-2.5 text-white/90 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`
          }
        >
          <LayoutDashboard className="h-[18px] w-[18px]" />
        </NavLink>
        <NavLink
          to="/transactions"
          title="Transactions"
          className={({ isActive }) =>
            `rounded-lg p-2.5 text-white/90 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`
          }
        >
          <ArrowLeftRight className="h-[18px] w-[18px]" />
        </NavLink>
        <NavLink
          to="/events"
          title="Events"
          className={({ isActive }) =>
            `rounded-lg p-2.5 text-white/90 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`
          }
        >
          <CalendarDays className="h-[18px] w-[18px]" />
        </NavLink>
        <NavLink
          to="/settings/profile"
          title="Settings"
          className={({ isActive }) =>
            `rounded-lg p-2.5 text-white/90 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`
          }
        >
          <UserCircle className="h-[18px] w-[18px]" />
        </NavLink>
      </aside>
    </>
  )
}
