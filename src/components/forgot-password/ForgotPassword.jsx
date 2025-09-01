import React, { useState } from 'react';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';
import ResetPasswordModal from '../modals/ResetPasswordModal';
import OtpModal from '../modals/GetOtpModal';
import SuccessModal from '../modals/SuccessModal';

const ForgotPassword = () => {
  const [showForgotModal, setShowForgotModal] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({});

  const handleOtpSent = (userEmail) => {
    setEmail(userEmail);
    setShowForgotModal(false);
    setShowResetModal(true);
  };

  const handleGetOtp = (data) => {
    setFormData(data);
    setShowResetModal(false);
    setShowOtpModal(true);
  };

  const handleOtpVerify = () => {
    setShowOtpModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    window.location.href = '/login';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #05041D 0%, #FF5722 100%)',
      }}
    >

      {showForgotModal && (
        <ForgotPasswordModal 
          onClose={() => {
            setShowForgotModal(false);
            window.location.href = '/login';
          }} 
          onOtpSent={handleOtpSent}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal 
          email={email}
          onClose={() => {
            setShowResetModal(false);
            window.location.href = '/login';
          }}
          onGetOtp={handleGetOtp}
          isForgotPassword={true}
        />
      )}

      {showOtpModal && (
        <OtpModal
          onClose={() => setShowOtpModal(false)}
          onVerify={handleOtpVerify}
          formData={formData}
          isForgotPassword={true}
          email={email}
        />
      )}

      {showSuccessModal && (
        <SuccessModal 
          open={showSuccessModal}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
};

export default ForgotPassword;