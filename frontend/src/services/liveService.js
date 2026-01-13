import api from './api';

export const liveService = {
  startLiveMode: async () => {
    const response = await api.post('/live/start');
    return response.data;
  },

  stopLiveMode: async () => {
    const response = await api.post('/live/stop');
    return response.data;
  },

  changeLiveSong: async (songId, pageNumber = 1) => {
    const response = await api.post('/live/change-song', { songId, pageNumber });
    return response.data;
  },

  getActiveSession: async () => {
    const response = await api.get('/live/session');
    return response.data;
  },

  getCurrentLiveSession: async () => {
    const response = await api.get('/live/current');
    return response.data;
  }
};