// Track events API calls
export const getTrackEventAthletes = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/api/v1/track-events/athletes?${params}`);
};

export const createTrackHeats = (data) => {
  return api.post('/api/v1/track-events/heats', data);
};

export const recordHeatResults = (data) => {
  return api.post('/api/v1/track-events/results', data);
};

export const createNextRound = (data) => {
  return api.post('/api/v1/track-events/next-round', data);
};

export const getHeats = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/api/v1/track-events/heats?${params}`);
};