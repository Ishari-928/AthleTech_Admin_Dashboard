import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return '*Enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    // 1) Email validation
    const emailError = validateEmail(email);
  if (emailError) {
    newErrors.email = emailError;
    valid = false;
  }

    if (!password) {
      newErrors.password = '*Password required';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong';

      if (message === 'User not found.') {
        setErrors((prev) => ({ ...prev, email: '*Enter user registered email.' }));
      } else if (message === 'Invalid password.') {
        setErrors((prev) => ({ ...prev, password: '*Invalid password.' }));
      } else {
        setErrors((prev) => ({ ...prev, general: message }));
      }
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #05041D 0%, #FF5722 100%)',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-[#FF5722]">Athlete</span>
            <span className="text-[#05041D]">Tech</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-[#05041D]">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#05041D] mb-1">
              Email Address
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: '' });
              }}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722] 
                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-[#05041D] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' });
              }}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722] 
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="mb-6 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* General error */}
          {errors.general && (
            <p className="text-red-500 text-sm text-center mb-3">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FF5722] text-white py-2 px-4 rounded hover:bg-[#B33F18] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
