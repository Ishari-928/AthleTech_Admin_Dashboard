import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSendOTP = async () => {
    await fetch("http://localhost:8080/api/v1/admin_auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStep(2);
  };

  const handleResetPassword = async () => {
    await fetch("http://localhost:8080/api/v1/admin_auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    alert("Password updated");
  };

  return (
    <div className="p-4">
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      )}
      {step === 2 && (
        <>
          <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
          <input placeholder="New Password" type="password" onChange={e => setNewPassword(e.target.value)} />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
