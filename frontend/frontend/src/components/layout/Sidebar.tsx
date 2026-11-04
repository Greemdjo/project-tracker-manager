import { NavLink } from 'react-router-dom'

const links = [
  { path: '/', label: 'Главная', icon: '◫' },
  { path: '/projects', label: 'Проекты', icon: '▦' },
  { path: '/developers', label: 'Разработчики', icon: '♙' },
  { path: '/reports', label: 'Отчёты', icon: '▤' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      <div className="px-6 py-7 border-b border-slate-700">
        <h1 className="text-xl font-bold">
          Project Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Управление проектами
        </p>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-5 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          Project Manager v1.0
        </p>
      </div>
    </aside>
  )
}