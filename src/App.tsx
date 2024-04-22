import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomList from './components/ToolListScreen.tsx';
import {NavigationContainer} from '@react-navigation/native';
import {BuildOutlined, ToolOutlined} from '@ant-design/icons';
import React from 'react';

function ToolsScreen({title}) {
  return (
    <CustomList
      title={title}
      data={[]}
      onAddItem={item => console.log('Added item:', item)}
      onDeleteItem={index => console.log('Deleted item at index:', index)}
      onUpdateItem={(index, item) =>
        console.log('Updated item at index:', index, item)
      }
    />
  );
}

function ToolMaterialsScreen({title}) {
  return (
    <CustomList
      title={title}
      data={[]}
      onAddItem={item => console.log('Added item:', item)}
      onDeleteItem={index => console.log('Deleted item at index:', index)}
      onUpdateItem={(index, item) =>
        console.log('Updated item at index:', index, item)
      }
    />
  );
}

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) =>
            route.name === 'ToolsScreen' ? (
              <ToolOutlined color={color} />
            ) : (
              <BuildOutlined color={color} />
            ),
        })}>
        <Tab.Screen
          name="ToolsScreen"
          component={ToolsScreen}
          props={{title: 'My Tools List'}}
        />
        <Tab.Screen
          name="ToolMaterialsScreen"
          component={ToolMaterialsScreen}
          props={{title: 'Tool Materials'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
