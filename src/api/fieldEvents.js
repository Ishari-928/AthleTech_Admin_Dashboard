import api from "./api";

// In your api/fieldEvents.js
export const getFieldEvents = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== 'all') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/api/v1/field-events?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field events:', error);
    throw error;
  }
};

export const getFieldEventAthletes = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== 'all') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/api/v1/field-events/athletes?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field event athletes:', error);
    throw error;
  }
};

export const updateFieldEventPerformance = async (performanceData) => {
  const response = await api.post('/api/v1/field-events/performance', performanceData);
  return response.data;
};

// Add to your api file
export const autoCreateNextRound = (data) => {
  return api.post('/api/v1/track-events/auto-next-round', data);
};