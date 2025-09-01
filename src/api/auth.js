import api from "./api";

export const requestOtp = async (email, purpose = 'first_login_change', channel = 'email') => {
  const response = await api.post("/api/v1/auth/request-otp", {
    email,
    purpose,
    channel
  });
  return response.data;
};

export const changePasswordWithOtp = async ({ email, otp, old_password, new_password, confirm_password }) => {
  const res = await api.post("/api/v1/auth/change-password-with-otp", {
    email,
    otp,
    old_password,
    new_password,
    confirm_password
  });
  return res.data;
};

// Add these functions
export const resetPasswordWithOtp = async ({ email, otp, new_password, confirm_password }) => {
  const res = await api.post("/api/v1/auth/reset-password-with-otp", {
    email,
    otp,
    new_password,
    confirm_password
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/api/v1/auth/forgot-password", { email });
  return res.data;
};
