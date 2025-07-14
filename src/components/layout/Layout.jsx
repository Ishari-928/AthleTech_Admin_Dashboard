import React from 'react'
import SideNavbar from '../navbar/SideNavbar'
import { useAuth } from '../../context/AuthContext'

const Layout = ({ children }) => {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen bg-[#DCEDFF]">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-[#05041D]">AthleTech</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#05041D]">Admin User</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-[#FF5722] text-white rounded hover:bg-[#B33F18] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
