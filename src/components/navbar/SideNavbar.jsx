import React, { useState } from 'react'
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
  ChevronDown,
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
    name: 'Track Event Performance',
    icon: <Activity size={20} />,
    children: [
      { name: 'Heat Events', path: '/track-heat-performance' },
      { name: 'Semi Final Events', path: '/track-semifinal-performance' },
      { name: 'Final Events', path: '/track-final-performance' },
    ],
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
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <aside className="w-64 min-h-screen bg-[#05041D] text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center space-x-1">
          <span className="text-[#FF5722]">Athlete</span>
          <span className="text-white">Tech</span>
        </h2>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) =>
          item.children ? (
            <div key={item.name}>
              <button
                onClick={() => toggleDropdown(item.name)}
                className="flex w-full items-center justify-between px-6 py-3 hover:bg-[#0B1219] transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-[#FF5722]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === item.name ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === item.name && (
                <div className="ml-10 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded hover:bg-[#0B1219] ${
                          isActive ? 'bg-[#0B1219] border-l-4 border-[#FF5722]' : ''
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
          )
        )}
      </nav>
    </aside>
  )
}

export default SideNavbar
