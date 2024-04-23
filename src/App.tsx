import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomListView from './components/CustomList.tsx';
import {NavigationContainer} from '@react-navigation/native';
import {BuildOutlined, ToolOutlined} from '@ant-design/icons';
import React from 'react';
import { getMaterials, getTools } from "./service/api.ts";

function ToolScreen({title}) {
  return (
    <CustomListView
      title={title}
      data={[getTools()]}
      onAddItem={item => console.log('Added item:', item)}
      onDeleteItem={index => console.log('Deleted item at index:', index)}
      onUpdateItem={(index, item) =>
        console.log('Updated item at index:', index, item)
      }
    />
  );
}

function MaterialScreen({title}) {
  return (
    <CustomListView
      title={title}
      data={getMaterials()}
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
            route.name === 'ToolScreen' ? (
              <ToolOutlined color={color} />
            ) : (
              <BuildOutlined color={color} />
            ),
        })}>
        <Tab.Screen
          name="ToolScreen"
          component={ToolScreen}
          props={{title: 'My Tools List'}}
        />
        <Tab.Screen
          name="MaterialScreen"
          component={MaterialScreen}
          props={{title: 'Tool Materials'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
