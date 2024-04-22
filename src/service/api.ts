import axios from 'axios';

const BASE_URL = 'mongodb://localhost:27017/';

const api = axios.create({
  baseURL: BASE_URL,
});

const getTools = async () => {
  try {
    const response = await api.get('/tools');
    return response.data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }
};

const addTool = async toolName => {
  try {
    const response = await api.post('/tools', {name: toolName});
    return response.data;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Tools:', error);
    throw error;
  }
};

const removeTool = async toolId => {
  try {
    await api.delete(`/tools/${toolId}`);
  } catch (error) {
    console.error('Fehler beim Entfernen des Tools:', error);
    throw error;
  }
};

export {getTools, addTool, removeTool};
