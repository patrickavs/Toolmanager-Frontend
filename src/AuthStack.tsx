import LoginView from './components/auth/Login.tsx';
import RegisterView from './components/auth/Register.tsx';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginView} />
      <AuthStack.Screen name="Register" component={RegisterView} />
    </AuthStack.Navigator>
  );
}

export default AuthStackScreen;
