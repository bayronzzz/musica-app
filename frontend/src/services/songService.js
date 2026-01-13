import api from './api';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const songService = {
  uploadSong: async (formData) => {
    const response = await api.post('/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },

  getAllSongs: async () => {
    const response = await api.get('/songs', {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  getSongById: async (id) => {
    const response = await api.get(`/songs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  updateSongTitle: async (id, title) => {
    const response = await api.put(
      `/songs/${id}`,
      { title },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  deleteSong: async (id) => {
    const response = await api.delete(`/songs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  updatePageName: async (songId, pageNumber, pageName) => {
    const response = await api.put(
      `/songs/${songId}/pages/${pageNumber}`,
      { pageName },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  getSongUrl: (filePath) => {
    return `${API_URL}/uploads/${filePath}`;
  }
};
