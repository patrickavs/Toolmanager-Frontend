import React, {createContext, ReactNode, useContext, useState} from 'react';
import {
  get_Materials_For_User,
  get_Tools_For_User,
  get_User,
} from '../service/api.ts';
import Tool from '../components/Tool.ts';
import Material from '../components/Material.ts';
import User from '../components/User.ts';

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  setRegisteredUser: (user: User) => void;
  tools: Tool[];
  materials: Material[];
  fetchTools: () => Promise<void>;
  fetchMaterials: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const fetchedUser = await get_User(user?.email || '');
    setUser(fetchedUser);
  };

  const setRegisteredUser = async (registeredUser: User) => {
    setUser(registeredUser);
  };

  const fetchTools = async () => {
    const fetchedTools = await get_Tools_For_User(user?.email || '');
    setTools(fetchedTools);
  };

  const fetchMaterials = async () => {
    const fetchedMaterials = await get_Materials_For_User(user?.email || '');
    setMaterials(fetchedMaterials);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        fetchUser,
        setRegisteredUser,
        tools,
        materials,
        fetchTools,
        fetchMaterials,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
