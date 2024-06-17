import LoginView from './components/auth/Login.tsx';
import RegisterView from './components/auth/Register.tsx';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={LoginView}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterView}
        options={{headerTitle: ''}}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackScreen;
