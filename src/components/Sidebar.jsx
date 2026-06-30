import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { logout } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/expenses', label: 'Expenses' },
    { to: '/ai', label: 'AI Assistant' },
  ]

  return (
    <aside className="w-full md:w-56 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-stone flex md:flex-col">
      <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-5">
  
  <img src="/expense_tracker_app_icon.svg" alt="" className="w-8 h-8 rounded-md flex-shrink-0" />
  

  <p className="font-display text-xl text-ink hidden md:block">Expense Tracker</p>
</div>

      <nav className="flex md:flex-col flex-1 px-2 md:px-4 py-2 gap-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              location.pathname === link.to
                ? 'bg-ink text-paper'
                : 'text-ink hover:bg-stone/30'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-2 md:px-4 py-2 md:py-4 md:mt-auto">
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-sage hover:underline w-full text-left"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar;