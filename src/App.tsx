import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Home from './Home.tsx';
import AuthStackScreen from './AuthStack.tsx';

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
    <NavigationContainer>
      {isAuthenticated ? <Home /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default App;
