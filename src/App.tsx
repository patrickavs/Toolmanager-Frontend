import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Home from './Home.tsx';
import AuthStackScreen from './AuthStack.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserProvider} from './context/UserContext.tsx';
import {setNavigation} from './service/api.ts';

const AppStack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <AppStack.Navigator initialRouteName="Login">
      <AppStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{headerShown: false}}
      />
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </AppStack.Navigator>
  );
}
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setIsAuthenticated(true);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    setNavigation(navigationRef.current);
  }, [navigationRef]);

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        {isAuthenticated ? <Home /> : <AppNavigator />}
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
