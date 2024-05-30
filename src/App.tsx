import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Home from './Home.tsx';
import AuthStackScreen from './AuthStack.tsx';
import {ItemsProvider} from './context/ItemsContext.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserProvider} from './context/UserContext.tsx';

const AppStack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <AppStack.Navigator>
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

  useEffect(() => {
    const checkLoginStatus = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(credentials);
        setIsAuthenticated(true);
      }
    };
    checkLoginStatus().then(r => console.log(r));
  }, [isAuthenticated]);

  return (
    <UserProvider>
      <ItemsProvider>
        <NavigationContainer>
          {isAuthenticated ? <Home /> : <AppNavigator />}
        </NavigationContainer>
      </ItemsProvider>
    </UserProvider>
  );
};

export default App;
