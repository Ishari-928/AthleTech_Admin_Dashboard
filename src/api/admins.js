import api from "./api";

export const cancelAdmin = async (id) => {
  const res = await api.patch(`/api/v1/admins/${id}/cancel`); 
  return res.data;
};

