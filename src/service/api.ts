import axios from 'axios';
import Tool from '../components/Tool';
import Material from '../components/Material';
import User from '../components/User';
import * as Keychain from 'react-native-keychain';

const BASE_URL = 'http://10.0.2.2:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

const setAuthorizationHeader = async (config: any) => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    config.headers.Authorization = `Bearer ${credentials.password}`;
  }
  return config;
};

const refreshAccessToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const response = await api.post(
        '/api/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${credentials.password}`,
          },
        },
      );
      const {access_token} = response.data;
      await Keychain.setGenericPassword('accessToken', access_token);
      return access_token;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    await Keychain.resetGenericPassword();
    return null;
  }
};

api.interceptors.request.use(async config => {
  return await setAuthorizationHeader(config);
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

// Tools

const getTools = async () => handleRequest(() => api.get('/tools'));
const getTool = async (id: string) =>
  handleRequest(() => api.get(`/tools/${id}`));
const addTool = async (tool: Tool) =>
  handleRequest(() => api.post('tools', tool));
const updateTool = async (toolId: string, data: {}) =>
  handleRequest(() => api.put(`tools/${toolId}`, data));
const removeTool = async (toolId: string) =>
  handleRequest(() => api.delete(`tools/${toolId}`));

// Materials

const getMaterials = async () => handleRequest(() => api.get('/materials'));
const getMaterial = async (id: string) =>
  handleRequest(() => api.get(`/materials/${id}`));
const addMaterial = async (material: Material) =>
  handleRequest(() => api.post('materials', material));
const updateMaterial = async (materialId: string, data: {}) =>
  handleRequest(() => api.put(`materials/${materialId}`, data));
const removeMaterial = async (materialId: string) =>
  handleRequest(() => api.delete(`materials/${materialId}`));

// Users

const getUsers = async () => handleRequest(() => api.get('/users'));
const getUser = async (id: string) =>
  handleRequest(() => api.get(`/users/${id}`));
const addUser = async (user: User) =>
  handleRequest(() => api.post('users', user));
const updateUser = async (userId: string, data: {}) =>
  handleRequest(() => api.put(`users/${userId}`, data));
const removeUser = async (userId: string) =>
  handleRequest(() => api.delete(`users/${userId}`));

// Authentication

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/login', {email, password});
    const {access_token, refresh_token} = response.data;
    await Keychain.setGenericPassword('accessToken', access_token);
    await Keychain.setGenericPassword('refreshToken', refresh_token);
    return access_token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const register = async (name: string, email: string, password: string) => {
  try {
    await api.post('/api/register', {name, email, password});
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const logout = async (token: string) => {
  try {
    await api.post('/api/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Helper function to handle requests
const handleRequest = async (request: () => Promise<any>) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

export {
  getTools,
  getTool,
  addTool,
  removeTool,
  updateTool,
  getMaterials,
  getMaterial,
  addMaterial,
  updateMaterial,
  removeMaterial,
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  login,
  register,
  logout,
};
