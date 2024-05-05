import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import ToolList from './components/lists/ToolList.tsx';
import MaterialList from './components/lists/MaterialList.tsx';

function ToolScreen() {
  return <ToolList />;
}

function MaterialScreen() {
  return <MaterialList />;
}

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, focused}) =>
            route.name === 'ToolScreen' ? (
              focused ? (
                <Ionicons name={'hammer'} color={color} size={30} />
              ) : (
                <Ionicons name={'hammer-outline'} color={color} size={30} />
              )
            ) : focused ? (
              <Ionicons name={'construct'} color={color} size={30} />
            ) : (
              <Ionicons name={'construct-outline'} color={color} size={30} />
            ),
        })}>
        <Tab.Screen name="ToolScreen" component={ToolScreen} />
        <Tab.Screen name="MaterialScreen" component={MaterialScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
