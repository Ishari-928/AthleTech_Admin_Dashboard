import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Medal,
  Activity,
  BarChart3,
  Trophy,
  Newspaper,
  UserCog,
} from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: 'System Users',
    path: '/system-users',
    icon: <UserCog size={20} />,
  },
  {
    name: 'All Registered Athletes',
    path: '/athletes',
    icon: <Users size={20} />,
  },
  {
    name: 'Performance Details',
    path: '/performance-details',
    icon: <Medal size={20} />,
  },
  {
    name: 'Track Performance',
    path: '/track-performance',
    icon: <Activity size={20} />,
  },
  {
    name: 'Field Performance',
    path: '/field-performance',
    icon: <BarChart3 size={20} />,
  },
  {
    name: 'School/Club Ranking',
    path: '/school-ranking',
    icon: <Trophy size={20} />,
  },
  {
    name: 'News Updates',
    path: '/news',
    icon: <Newspaper size={20} />,
  },
  {
    name: 'Coaches Details',
    path: '/coaches',
    icon: <UserCog size={20} />,
  },
  {
    name: 'All Events List',
    path: '/all-events',
    icon: <UserCog size={20} />,
  },
]

const SideNavbar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[#05041D] text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center space-x-1">
          <span className="text-[#FF5722]">Athlete</span>
          <span className="text-white">Tech</span>
        </h2>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 transition-colors duration-200 hover:bg-[#0B1219] ${
                isActive ? 'bg-[#0B1219] border-l-4 border-[#FF5722]' : ''
              }`
            }
          >
            <span className="mr-3 text-[#FF5722]">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default SideNavbar;