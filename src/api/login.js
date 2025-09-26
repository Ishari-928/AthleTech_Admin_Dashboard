import api from "./api";

export const loginAdmin = async ({ email, password }) => {
  const response = await api.post("/api/v1/auth/login", { email, password });

  const data = response.data;
  // console.error("Login response data:", response);
  // console.warn("Login response data:",  response.data.token);

  if (data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return data;
};


