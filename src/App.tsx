import React, {useEffect, useRef} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Home from './Home.tsx';
import AuthStackScreen from './AuthStack.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserProvider, useUserContext} from './context/UserContext.tsx';
import {setNavigation} from './service/api.ts';

const AppStack = createNativeStackNavigator();

function AppNavigator() {
  const navigation = useNavigation();
  const {setRegisteredUser} = useUserContext();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await Keychain.getGenericPassword();
        if (accessToken) {
          const credentials = await Keychain.getInternetCredentials('user');
          if (credentials) {
            console.log('loaded User');
            const savedUser = JSON.parse(credentials.password);
            setRegisteredUser(savedUser);
            //@ts-ignore
            navigation.navigate('Home');
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
  const navigationRef = useRef(null);

  useEffect(() => {
    setNavigation(navigationRef.current);
  }, [navigationRef]);

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
