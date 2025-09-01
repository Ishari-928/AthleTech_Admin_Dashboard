import api from "./api";

export const getCoaches = async () => {
  const response = await api.get("/api/v1/coaches");
  return response.data;
};

export const getActiveCoaches = async () => {
  const response = await api.get("/api/v1/coaches/active");
  return response.data;
};

export const getCoachById = async (id) => {
  const response = await api.get(`/api/v1/coaches/${id}`);
  return response.data;
};

export const createCoach = async (formData) => {
  const response = await api.post("/api/v1/coaches", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateCoach = async (id, formData) => {
  const response = await api.put(`/api/v1/coaches/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Use hard delete endpoint to completely remove the coach
export const deleteCoach = async (id) => {
  const response = await api.delete(`/api/v1/coaches/${id}/delete`);
  return response.data;
};

// Keep this if you need both soft and hard delete options
export const softDeleteCoach = async (id) => {
  const response = await api.delete(`/api/v1/coaches/${id}`);
  return response.data;
};

