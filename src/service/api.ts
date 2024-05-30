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
      // Update access token in Axios instance
      api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
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
      const newAccessToken = await refreshAccessToken().catch(r =>
        console.error(r),
      );
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest).catch(r => {
          console.error(r);
        });
      }
    }
    return Promise.reject(error);
  },
);

// Tools

const get_Tools = async () => handleRequest(() => api.get('/tools'));
const get_Tool = async (id: string) =>
  handleRequest(() => api.get(`/tools/${id}`));
const add_Tool = async (tool: Tool) =>
  handleRequest(() => api.post('tools', tool));
const update_Tool = async (toolId: string, data: {}) =>
  handleRequest(() => api.put(`tools/${toolId}`, data));
const remove_Tool = async (toolId: string) =>
  handleRequest(() => api.delete(`tools/${toolId}`));

// Materials

const get_Materials = async () => handleRequest(() => api.get('/materials'));
const get_Material = async (id: string) =>
  handleRequest(() => api.get(`/materials/${id}`));
const add_Material = async (material: Material) =>
  handleRequest(() => api.post('materials', material));
const update_Material = async (materialId: string, data: {}) =>
  handleRequest(() => api.put(`materials/${materialId}`, data));
const remove_Material = async (materialId: string) =>
  handleRequest(() => api.delete(`materials/${materialId}`));

// Users

const get_Users = async () => handleRequest(() => api.get('/users'));
const get_User = async (email: string) =>
  handleRequest(() => api.get(`/users/${email}`));
const add_User = async (user: User) =>
  handleRequest(() => api.post('users', user));
const update_User = async (email: string, data: {}) =>
  handleRequest(() => api.put(`users/${email}`, data));
const remove_User = async (userId: string) =>
  handleRequest(() => api.delete(`users/${userId}`));
const get_Tools_For_User = async (email: string) =>
  handleRequest(() => api.get(`/tools/${email}`));
const get_Materials_For_User = async (email: string) =>
  handleRequest(() => api.get(`/materials/${email}`));

// Authentication

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/login', {email, password});
    const {access_token, refresh_token} = response.data;
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
  get_Tools,
  get_Tool,
  add_Tool,
  remove_Tool,
  update_Tool,
  get_Materials,
  get_Material,
  add_Material,
  update_Material,
  remove_Material,
  get_Users,
  get_User,
  add_User,
  update_User,
  remove_User,
  get_Tools_For_User,
  get_Materials_For_User,
  login,
  register,
  logout,
};
