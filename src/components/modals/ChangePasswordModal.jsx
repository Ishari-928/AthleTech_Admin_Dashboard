import React, {useState} from 'react'
import { useAuth } from '../../context/AuthContext'
import { requestOtp } from '../../api/auth'
import { Eye, EyeOff } from 'lucide-react' 

const ChangePasswordModal = ({ onClose, onGetOtp }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  //eye icon state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await requestOtp(user.email, 'first_login_change');
      onGetOtp({
        currentPassword,
        newPassword,
        confirmPassword
      });
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Failed to request OTP' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-full max-w-md"
        style={{
          background: 'linear-gradient(135deg, #05041D 0%, #FF5722 100%)',
        }}
      >
        <h1 className="text-3xl font-bold mb-4 text-[#FFFFFF] text-center">
          Change Password
        </h1>

        {errors.general && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-m font-medium text-gray-200 mb-1">
              Current Password
            </label>
            <input
              type= {showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722] ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-300"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.currentPassword && (
              <p className="text-red-300 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-m font-medium text-gray-200 mb-1">
              New Password
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722] ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-300"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.newPassword && (
              <p className="text-red-300 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <label className="block text-m font-medium text-gray-200 mb-1">
              Confirm New Password
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722] ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-300"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-200 hover:bg-[#B33F18]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF5722] text-white rounded hover:bg-[#B33F18] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
