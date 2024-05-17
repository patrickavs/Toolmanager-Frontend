import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ToolList from './components/tabs/ToolList.tsx';
import MaterialList from './components/tabs/MaterialList.tsx';
import DetailView from './components/DetailView.tsx';
import EditProfile from './components/EditProfile.tsx';
import ProfileView from './components/tabs/ProfileView.tsx';

const AuthStack = createNativeStackNavigator();
const ToolStack = createNativeStackNavigator();
const MaterialStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();

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
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}

function UserStackScreen() {
  return (
    <UserStack.Navigator
      initialRouteName="Profile"
      screenOptions={{headerStyle: {backgroundColor: 'orange'}}}>
      <UserStack.Screen name="Profile" component={ProfileView} />
      <UserStack.Screen name="Edit" component={EditProfile} />
    </UserStack.Navigator>
  );
}

function ToolStackScreen() {
  return (
    <ToolStack.Navigator
      initialRouteName="Tools"
      screenOptions={{headerStyle: {backgroundColor: 'orange'}}}>
      <ToolStack.Screen name="Tools" component={ToolList} />
      <ToolStack.Screen name="DetailView" component={DetailView} />
    </ToolStack.Navigator>
  );
}

function MaterialStackScreen() {
  return (
    <MaterialStack.Navigator
      initialRouteName="Materials"
      screenOptions={{headerStyle: {backgroundColor: 'orange'}}}>
      <MaterialStack.Screen name="Materials" component={MaterialList} />
      <MaterialStack.Screen name="DetailView" component={DetailView} />
    </MaterialStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, focused}) => {
            let iconName;

            if (route.name === 'ToolStack') {
              iconName = focused ? 'hammer' : 'hammer-outline';
            } else if (route.name === 'MaterialStack') {
              iconName = focused ? 'construct' : 'construct-outline';
            } else if (route.name === 'UserStack') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicon name={iconName || ''} color={color} size={30} />;
          },
          headerShown: false,
          tabBarShowLabel: false,
        })}>
        <Tab.Screen name="ToolStack" component={ToolStackScreen} />
        <Tab.Screen name="MaterialStack" component={MaterialStackScreen} />
        <Tab.Screen name="UserStack" component={UserStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
