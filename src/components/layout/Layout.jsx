import React, { useEffect, useState, useRef } from 'react'
import SideNavbar from '../navbar/SideNavbar'
import { useAuth } from '../../context/AuthContext'
import { User, ChevronDown, Lock } from 'lucide-react'
import ChangePasswordModal from "../modals/ChangePasswordModal"
import OtpModal from '../modals/GetOtpModal'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpFormData, setOtpFormData] = useState(null)
  const profileMenuRef = useRef(null)
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleGetOtp = (formData) => {
    setOtpFormData(formData);
    setShowPasswordModal(false);
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (otp) => {
    console.log("OTP verified:", otp);
    setShowOtpModal(false);
  };

  return (
    <div className="flex h-screen bg-[#DCEDFF]">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold text-[#05041D]">AthleTech</h1>

            {/* Profile Dropdown */}
            <div className="relative mr-6" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5722] flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.name}</p>
                </div>
                <ChevronDown size={24} className="text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-orange-500 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowPasswordModal(true)
                      setShowProfileMenu(false)
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Lock size={16} className="mr-2" />
                    Change Password
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal 
          onClose={() => setShowPasswordModal(false)} 
          onGetOtp={handleGetOtp}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && otpFormData && (
        <OtpModal 
          onClose={() => setShowOtpModal(false)} 
          onVerify={handleVerifyOtp}
          formData={otpFormData}
        />
      )}
    </div>
  )
}

export default Layout
