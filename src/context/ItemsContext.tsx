import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  add_Material,
  add_Tool,
  get_Material,
  get_Materials,
  get_Tool,
  get_Tools,
  remove_Material,
  remove_Tool,
  update_Material,
  update_Tool,
} from '../service/api.ts';
import Tool from '../components/Tool.ts';
import Material from '../components/Material.ts';

interface ItemsContextType {
  tools: Tool[];
  materials: Material[];
  fetchTools: () => Promise<void>;
  fetchMaterials: () => Promise<void>;
  fetchTool: (id: string) => Promise<void>;
  fetchMaterial: (id: string) => Promise<void>;
  addTool: (newTool: Tool) => Promise<void>;
  addMaterial: (newMaterial: Material) => Promise<void>;
  modifyTool: (id: string, updatedTool: Tool) => Promise<void>;
  modifyMaterial: (id: string, updatedMaterial: Material) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(
  undefined,
);

export const ItemsProvider = ({children}: {children: ReactNode}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  const fetchTools = async () => {
    const fetchedTools = await get_Tools();
    setTools(fetchedTools);
  };

  const fetchMaterials = async () => {
    const fetchedMaterials = await get_Materials();
    setMaterials(fetchedMaterials);
  };

  const fetchTool = async (id: string) => {
    return await get_Tool(id);
  };

  const fetchMaterial = async (id: string) => {
    return await get_Material(id);
  };

  const addTool = async (newTool: Tool) => {
    await add_Tool(newTool);
    await fetchTools();
  };

  const addMaterial = async (newMaterial: Material) => {
    await add_Material(newMaterial);
    await fetchMaterials();
  };

  const modifyTool = async (id: string, updatedTool: Tool) => {
    await update_Tool(id, updatedTool);
    await fetchTools();
  };

  const modifyMaterial = async (id: string, updatedMaterial: Material) => {
    await update_Material(id, updatedMaterial);
    await fetchMaterials();
  };

  const deleteTool = async (id: string) => {
    await remove_Tool(id);
    await fetchTools();
  };

  const deleteMaterial = async (id: string) => {
    await remove_Material(id);
    await fetchMaterials();
  };

  useEffect(() => {
    fetchTools();
    fetchMaterials();
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        tools,
        materials,
        fetchTools,
        fetchMaterials,
        fetchTool,
        fetchMaterial,
        addTool,
        addMaterial,
        modifyTool,
        modifyMaterial,
        deleteTool,
        deleteMaterial,
      }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItemsContext = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
