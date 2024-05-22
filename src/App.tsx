import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Home from './Home.tsx';
import AuthStackScreen from './AuthStack.tsx';
import {ItemsProvider} from './context/ItemsContext.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setIsAuthenticated(true);
      }
    };
    checkLoginStatus().then(r => console.log(r));
  }, []);

  return (
    <ItemsProvider>
      <NavigationContainer>
        {isAuthenticated ? <Home /> : <AuthStackScreen />}
      </NavigationContainer>
    </ItemsProvider>
  );
};

export default App;
