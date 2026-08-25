import api from './api';

export const getTrackEventAthletes = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  return api.get(`/api/v1/heats/athletes?${params}`);
};

export const createTrackHeats = (data) => {
  return api.post('/api/v1/heats/create-heats', data);
};

export const getHeats = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  return api.get(`/api/v1/heats/get-heats?${params}`);
};

export const updateHeatResults = (data) => {
  return api.patch('/api/v1/heats/update-heat-results', data);
};

export const bulkUpdateHeatResults = (data) => {
  return api.patch('/api/v1/heats/bulk-update-heat-results', data);
};

export const autoUpdateQualification = (data) => {
  return api.patch('/api/v1/heats/auto-qualification', data);
};

export const createSemifinals = (data) => {
  return api.post('/api/v1/heats/create-semifinals', data);
};

export const getSemifinals = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  return api.get(`/api/v1/heats/get-semifinals?${params}`);
};

export const updateSemifinalResults = (data) => {
  return api.patch('/api/v1/heats/update-semifinal-results', data);
};

export const bulkUpdateSemifinalResults = (data) => {
  return api.patch('/api/v1/heats/bulk-update-semifinal-results', data);
};

export const updateSemifinalTiming = (data) => {
  return api.patch('/api/v1/heats/update-semifinal-timing', data);
};

export const getFinals = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  });
  return api.get(`/api/v1/heats/get-finals?${params}`);
};

export const updateFinalResults = (data) => {
  return api.patch('/api/v1/heats/update-final-results', data);
};

export const bulkUpdateFinalResults = (data) => {
  return api.patch('/api/v1/heats/bulk-update-final-results', data);
};