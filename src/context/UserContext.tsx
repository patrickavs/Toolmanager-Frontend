import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  get_Materials_For_User,
  get_Tools_For_User,
  get_User,
  login,
  logout,
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
  fetchTools: () => Promise<void>;
  fetchMaterials: () => Promise<void>;
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
        const credentials = await Keychain.getInternetCredentials('user');
        if (credentials) {
          const savedUser = JSON.parse(credentials.password);
          const accessToken = await Keychain.getGenericPassword();

          if (accessToken) {
            setUser(savedUser);
          } else {
            await Keychain.resetInternetCredentials('user');
            await Keychain.resetGenericPassword();
          }
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

  const fetchTools = async () => {
    const fetchedTools = await get_Tools_For_User(user?.email || '');
    setTools(fetchedTools);
  };

  const fetchMaterials = async () => {
    const fetchedMaterials = await get_Materials_For_User(user?.email || '');
    setMaterials(fetchedMaterials);
  };

  const loginUser = async (email: string, password: string) => {
    await login(email, password);
    const fetchedUser = await get_User(email);
    if (fetchedUser) {
      setUser(fetchedUser);
      await Keychain.setInternetCredentials(
        'user',
        'user',
        JSON.stringify(fetchedUser),
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
        fetchTools,
        fetchMaterials,
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
