import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Headphones, ChevronDown, UserCircle, Key, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { logout as logoutApi } from '../../api/auth.api'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const displayName = user?.name?.split(' ')[0]?.toLowerCase() ?? 'techengood'
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'TG'

  const handleLogout = async () => {
    setOpen(false)
    try {
      await logoutApi()
    } catch {
      /* ignore */
    }
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-brand px-4 text-white md:left-16 lg:left-64 pl-14 md:pl-4">
      <h1 className="text-base font-bold md:text-lg">TECH&apos;N GOODWIL LTD</h1>
      <div className="flex items-center gap-3">
        <a
          href="https://app.safulpay.com"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 text-sm text-white hover:underline sm:flex"
        >
          <Headphones className="h-4 w-4" />
          Support Ticket
        </a>
        <div className="hidden h-6 w-px bg-white/30 sm:block" />
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10"
          >
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                {initials}
              </span>
            )}
            <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
            <ChevronDown className="h-4 w-4 opacity-90" />
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 text-gray-800 shadow-xl">
              <Link
                to="/settings/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <UserCircle className="h-4 w-4 text-brand" />
                Profile Setting
              </Link>
              <Link
                to="/settings/pin"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <Key className="h-4 w-4 text-brand" />
                Change Password
              </Link>
              <Link
                to="/settings/2fa"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <Shield className="h-4 w-4 text-brand" />
                2FA Security
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
