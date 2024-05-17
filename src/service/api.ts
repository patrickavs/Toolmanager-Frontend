import axios from 'axios';
import Tool from '../components/Tool.ts';
import Material from '../components/Material.ts';
import User from '../components/User.ts';

const BASE_URL = 'http://10.0.2.2:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

// Tools

const getTools = async () => {
  try {
    const response = await api.get('/tools');
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

const getTool = async (id: string) => {
  try {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tool:', error);
    throw error;
  }
};

const addTool = async (tool: Tool) => {
  try {
    await api.post('tools', tool);
  } catch (error) {
    console.error('Error adding tool:', error);
    throw error;
  }
};

const updateTool = async (toolId: string, data: {}) => {
  try {
    await api.put(`tools/${toolId}`, data);
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error;
  }
};

const removeTool = async (toolId: string) => {
  try {
    await api.delete(`tools/${toolId}`);
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
};

// Materials

const getMaterials = async () => {
  try {
    const response = await api.get('/materials');
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

const getMaterial = async (id: string) => {
  try {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

const addMaterial = async (material: Material) => {
  try {
    await api.post('materials', material);
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

const updateMaterial = async (materialId: string, data: {}) => {
  try {
    await api.put(`materials/${materialId}`, data);
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

const removeMaterial = async (materialId: string) => {
  try {
    await api.delete(`materials/${materialId}`);
  } catch (error) {
    console.error('Error removing material:', error);
    throw error;
  }
};

// User

const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUser = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const addUser = async (user: User) => {
  try {
    await api.post('users', user);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

const updateUser = async (userId: string, data: {}) => {
  try {
    await api.put(`users/${userId}`, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const removeUser = async (userId: string) => {
  try {
    await api.delete(`users/${userId}`);
  } catch (error) {
    console.error('Error removing user:', error);
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
};
