import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomListView from './components/CustomList.tsx';
import {NavigationContainer} from '@react-navigation/native';
import {BuildOutlined, ToolOutlined} from '@ant-design/icons';
import React from 'react';
import Tool from './components/Tool.ts';
import Material from './components/Material.ts';

function ToolScreen({title}: {title: string}) {
  return <CustomListView<Tool> title={title} type={Tool} />;
}

function MaterialScreen({title}: {title: string}) {
  return <CustomListView<Material> title={title} type={Material} />;
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
