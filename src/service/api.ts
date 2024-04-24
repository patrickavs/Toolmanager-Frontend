import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

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

const addTool = async (toolName: string) => {
  try {
    const response = await api.post('/tools', {name: toolName});
    return response.data;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Tools:', error);
    throw error;
  }
};

const updateTool = async (toolId: string, data: {}) => {
  try {
    const response = await api.put(`/tools/${toolId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error;
  }
};

const removeTool = async (toolId: string) => {
  try {
    await api.delete(`/tools/${toolId}`);
  } catch (error) {
    console.error('Fehler beim Entfernen des Tools:', error);
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

const addMaterial = async (materialName: string) => {
  try {
    const response = await api.post('/materials', {name: materialName});
    return response.data;
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

const updateMaterial = async (materialId: string, data: {}) => {
  try {
    const response = await api.put(`/materials/${materialId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

const removeMaterial = async (materialId: string) => {
  try {
    await api.delete(`/materials/${materialId}`);
  } catch (error) {
    console.error('Error removing material:', error);
    throw error;
  }
};

export {
  getTools,
  addTool,
  removeTool,
  updateTool,
  getMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
};
