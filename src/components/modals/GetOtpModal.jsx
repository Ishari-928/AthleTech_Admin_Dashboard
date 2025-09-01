import React, { useState, useRef, useEffect } from "react";
import { Shield, Clock } from "lucide-react";
import { requestOtp, changePasswordWithOtp, resetPasswordWithOtp } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const OtpModal = ({ onClose, onVerify, formData, isForgotPassword = false, email = ""  }) => {
  const { user } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);
  

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 5) {
        otpInputRefs[index + 1].current.focus();
      }
      
      // Auto-submit when all fields are filled
      if (index === 5 && value !== "") {
        const fullOtp = newOtp.join("");
        if (fullOtp.length === 6) {
          verifyOtp(fullOtp);
        }
      }
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      otpInputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP verification
  const verifyOtp = async (otpValue) => {
    setLoading(true);
    setError("");
    // try {
    //   await changePasswordWithOtp({
    //     email: user.email,
    //     otp: otpValue,
    //     old_password: formData.currentPassword,
    //     new_password: formData.newPassword,
    //     confirm_password: formData.confirmPassword
    //   });
    //   onVerify(otpValue);
    //   onClose();
    //   // Show success message (you might want to add a success modal)
    //   alert("Password changed successfully!");
    // } catch (err) {
    //   setError(err.response?.data?.message || "Failed to verify OTP");
    // } finally {
    //   setLoading(false);
    // }
    try {
      if (isForgotPassword) {
        // For forgot password flow
        await resetPasswordWithOtp({
          email: email,
          otp: otpValue,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword
        });
        onVerify(otpValue);
        onClose();
        alert("Password reset successfully!");
      } else {
        // For change password flow (existing)
        await changePasswordWithOtp({
          email: user.email,
          otp: otpValue,
          old_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword
        });
        onVerify(otpValue);
        onClose();
        alert("Password changed successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const resendOtp = async () => {
    setResendLoading(true);
    setError("");
    // try {
    //   await requestOtp(user.email);
    //   setOtp(["", "", "", "", "", ""]);
    //   setTimeLeft(60);
    //   setIsExpired(false);
    //   otpInputRefs[0].current.focus();
    // } catch (err) {
    //   setError(err.response?.data?.message || "Failed to resend OTP");
    // } finally {
    //   setResendLoading(false);
    // }
    try {
      const purpose = isForgotPassword ? "reset_password" : "first_login_change";
      await requestOtp(isForgotPassword ? email : user.email, purpose);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      setIsExpired(false);
      otpInputRefs[0].current.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md m-4 relative z-10 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Shield Icon */}
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Verify your code
          </h2>
          <p className="text-center text-gray-600 mb-6">
            We have sent a code to your email
            <br />
            <span className="font-medium">{isForgotPassword ? email : (user?.email || formData.email)}</span>
          </p>

          <div className="flex items-center mb-4 text-sm">
            <Clock size={16} className="mr-1" />
            <span className={timeLeft < 10 ? "text-red-500 font-medium" : "text-gray-600"}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}


          {/* OTP Input Fields */}
          <div className="flex space-x-2 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={otpInputRefs[index]}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isExpired || loading}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => verifyOtp(otp.join(""))}
            disabled={otp.join("").length !== 6 || isExpired || loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          {isExpired && (
            <div className="text-red-500 text-sm mb-2">
              Time period ended. Please resend the code.
            </div>
          )}

          {/* Resend Option */}
          <div className="text-sm text-gray-600">
            Didn't receive code?{" "}
            <button
              onClick={resendOtp}
              disabled={resendLoading || (!isExpired && timeLeft > 0)}
              className="text-blue-500 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OtpModal;
