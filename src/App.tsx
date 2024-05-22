import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ToolList from './components/lists/ToolList.tsx';
import MaterialList from './components/lists/MaterialList.tsx';
import DetailView from './components/DetailView.tsx';
import {ItemsProvider} from './context/ItemsContext.tsx';

const ToolStack = createNativeStackNavigator();
const MaterialStack = createNativeStackNavigator();

function ToolStackScreen() {
  return (
    <ToolStack.Navigator
      screenOptions={{headerStyle: {backgroundColor: 'orange'}}}>
      <ToolStack.Screen name="Tools" component={ToolList} />
      <ToolStack.Screen name="DetailView" component={DetailView} />
    </ToolStack.Navigator>
  );
}

function MaterialStackScreen() {
  return (
    <MaterialStack.Navigator
      screenOptions={{headerStyle: {backgroundColor: 'orange'}}}>
      <MaterialStack.Screen name="Materials" component={MaterialList} />
      <MaterialStack.Screen name="DetailView" component={DetailView} />
    </MaterialStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <ItemsProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color, focused}) =>
              route.name === 'ToolStack' ? (
                focused ? (
                  <Ionicons name="hammer" color={color} size={30} />
                ) : (
                  <Ionicons name="hammer-outline" color={color} size={30} />
                )
              ) : focused ? (
                <Ionicons name="construct" color={color} size={30} />
              ) : (
                <Ionicons name="construct-outline" color={color} size={30} />
              ),
            headerShown: false,
            tabBarShowLabel: false,
          })}>
          <Tab.Screen name="ToolStack" component={ToolStackScreen} />
          <Tab.Screen name="MaterialStack" component={MaterialStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ItemsProvider>
  );
};

export default App;
