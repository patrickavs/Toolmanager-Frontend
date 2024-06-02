import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  add_Material_To_User,
  add_Tool_To_User,
  get_Materials_For_User,
  get_Tools_For_User,
  remove_Tool_From_User,
  remove_Material_From_User,
  get_User,
  login,
  logout,
  add_Tool,
  add_Material,
  remove_Tool,
  remove_Material,
} from '../service/api.ts';
import Tool from '../components/Tool.ts';
import Material from '../components/Material.ts';
import User from '../components/User.ts';
import * as Keychain from 'react-native-keychain';

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  setRegisteredUser: (user: User) => void;
  tools: Tool[];
  materials: Material[];
  fetchToolsFromUser: () => Promise<void>;
  fetchMaterialsFromUser: () => Promise<void>;
  addToolToUser: (newTool: Tool) => Promise<void>;
  addMaterialToUser: (newMaterial: Material) => Promise<void>;
  deleteToolFromUser: (id: string) => Promise<void>;
  deleteMaterialFromUser: (id: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await Keychain.getGenericPassword();
        if (accessToken) {
          const credentials = await Keychain.getInternetCredentials('user');
          if (credentials) {
            const savedUser = JSON.parse(credentials.password);
            setUser(savedUser);
          }
        } else {
          await Keychain.resetInternetCredentials('user');
          await Keychain.resetGenericPassword();
        }
      } catch (error) {
        console.error('Failed to load user from keychain', error);
      }
    };

    loadUser();
  }, []);

  const fetchUser = async () => {
    const fetchedUser = await get_User(user?.email || '');
    if (fetchedUser) {
      setUser(fetchedUser);
      await Keychain.setInternetCredentials(
        'user',
        'user',
        JSON.stringify(fetchedUser),
      );
    }
  };

  const setRegisteredUser = async (registeredUser: User) => {
    setUser(registeredUser);
    await Keychain.setInternetCredentials(
      'user',
      'user',
      JSON.stringify(registeredUser),
    );
  };

  const fetchToolsFromUser = async () => {
    const fetchedTools = await get_Tools_For_User(user?.email || '');
    setTools(fetchedTools);
  };

  const fetchMaterialsFromUser = async () => {
    const fetchedMaterials = await get_Materials_For_User(user?.email || '');
    setMaterials(fetchedMaterials);
  };

  const addToolToUser = async (tool: Tool) => {
    const _id = tool._id;
    await add_Tool_To_User(user?.email || '', {_id});
    await add_Tool(tool);
    await fetchToolsFromUser();
  };

  const addMaterialToUser = async (material: Material) => {
    const _id = material._id;
    await add_Material_To_User(user?.email || '', {_id});
    await add_Material(material);
    await fetchMaterialsFromUser();
  };

  const deleteToolFromUser = async (id: string) => {
    await remove_Tool_From_User(user?.email || '', id);
    await remove_Tool(id);
    await fetchToolsFromUser();
  };

  const deleteMaterialFromUser = async (id: string) => {
    await remove_Material_From_User(user?.email || '', id);
    await remove_Material(id);
    await fetchMaterialsFromUser();
  };

  const loginUser = async (email: string, password: string) => {
    await login(email, password);
    const fetchedUser = await get_User(email);
    if (fetchedUser) {
      setUser(fetchedUser);
      await Keychain.setInternetCredentials(
        'user',
        'user',
        JSON.stringify(fetchedUser as User),
      );
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setTools([]);
    setMaterials([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        fetchUser,
        setRegisteredUser,
        tools,
        materials,
        fetchToolsFromUser: fetchToolsFromUser,
        fetchMaterialsFromUser: fetchMaterialsFromUser,
        addToolToUser,
        addMaterialToUser,
        deleteToolFromUser,
        deleteMaterialFromUser,
        loginUser,
        logoutUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
