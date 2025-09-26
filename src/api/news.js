import api from "./api";

export const getNewsUpdates = async () => {
  const response = await api.get("/api/v1/news-updates");
  return response.data;
};

export const getActiveNewsUpdates = async () => {
  const response = await api.get("/api/v1/news-updates/active");
  return response.data;
};

export const getNewsUpdateById = async (id) => {
  const response = await api.get(`/api/v1/news-updates/${id}`);
  return response.data;
};

export const createNewsUpdate = async (formData) => {
  const response = await api.post("/api/v1/news-updates", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateNewsUpdate = async (id, formData) => {
  const response = await api.put(`/api/v1/news-updates/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteNewsUpdate = async (id) => {
  const response = await api.delete(`/api/v1/news-updates/${id}`);
  return response.data;
};

export const hardDeleteNewsUpdate = async (id) => {
  const response = await api.delete(`/api/v1/news-updates/${id}/delete`);
  return response.data;
};