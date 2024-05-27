import axios from 'axios';
import Tool from '../components/Tool.ts';
import Material from '../components/Material.ts';

const BASE_URL = 'http://10.0.2.2:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

// Tools

const get_Tools = async () => {
  try {
    const response = await api.get('/tools');
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

const get_Tool = async (id: string) => {
  try {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tool:', error);
    throw error;
  }
};

const add_Tool = async (tool: Tool) => {
  try {
    await api.post('tools', tool);
  } catch (error) {
    console.error('Error adding tool:', error);
    throw error;
  }
};

const update_Tool = async (toolId: string, data: any) => {
  try {
    await api.put(`tools/${toolId}`, data);
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error;
  }
};

const remove_Tool = async (toolId: string) => {
  try {
    await api.delete(`tools/${toolId}`);
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
};

// Materials

const get_Materials = async () => {
  try {
    const response = await api.get('/materials');
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

const get_Material = async (id: string) => {
  try {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

const add_Material = async (material: Material) => {
  try {
    await api.post('materials', material);
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

const update_Material = async (materialId: string, data: any) => {
  try {
    await api.put(`materials/${materialId}`, data);
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

const remove_Material = async (materialId: string) => {
  try {
    await api.delete(`materials/${materialId}`);
  } catch (error) {
    console.error('Error removing material:', error);
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
};
