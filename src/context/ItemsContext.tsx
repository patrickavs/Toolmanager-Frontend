import React, {createContext, ReactNode} from 'react';
import Tool from '../components/Tool';
import Material from '../components/Material';
import {getMaterial, getTool, updateMaterial, updateTool} from '../service/api';

interface ItemsContextType {
  modifyTool: (id: string, updatedTool: Tool) => Promise<void>;
  modifyMaterial: (id: string, updatedMaterial: Material) => Promise<void>;
  receiveTool: (id: string) => Promise<Tool>;
  receiveMaterial: (id: string) => Promise<Material>;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(
  undefined,
);

export const ItemsProvider = ({children}: {children: ReactNode}) => {
  const modifyTool = async (id: string, updatedTool: Tool) => {
    await updateTool(id, updatedTool);
  };

  const modifyMaterial = async (id: string, updatedMaterial: Material) => {
    await updateMaterial(id, updatedMaterial);
  };

  const receiveTool = async (id: string): Promise<Tool> => {
    return await getTool(id);
  };

  const receiveMaterial = async (id: string): Promise<Material> => {
    return await getMaterial(id);
  };

  return (
    <ItemsContext.Provider
      value={{modifyTool, modifyMaterial, receiveTool, receiveMaterial}}>
      {children}
    </ItemsContext.Provider>
  );
};
