import React, {useState, useEffect} from 'react';
import {Button, FlatList, Text, TextInput, View, Modal} from 'react-native';

import {getTools, addTool, updateTool, removeTool} from '../../service/api.ts';
import ListItem from '../ListItemView.tsx';
import Tool from '../Tool.ts';
import ObjectID from 'bson-objectid';

const initialState: Tool = {
  _id: ObjectID().toHexString(),
  name: '',
  description: '',
  materials: [],
};

const ToolList = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [newTool, setNewTool] = useState<Tool>(initialState);

  useEffect(() => {
    fetchTools().then(r => console.log(r));
  }, []);

  const fetchTools = async () => {
    try {
      const fetchedTools = await getTools();
      setTools(fetchedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleAddTool = async () => {
    try {
      await addTool(newTool);
      setIsAddItemModalVisible(false);
      setNewTool(initialState);
      await fetchTools();
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      await removeTool(id);
      setTools(tools.filter(tool => tool.id !== id));
      await fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const handleUpdateTool = async (id: string, data: Partial<Tool>) => {
    try {
      await updateTool(id, data);
      await fetchTools();
    } catch (error) {
      console.error('Error updating tool:', error);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setNewTool({...newTool, [name]: value});
  };

  const renderInputFields = () => {
    return (
      <>
        <TextInput
          key="name"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Name"
          onChangeText={text => handleInputChange('name', text)}
          value={newTool.name || ''}
        />
        <TextInput
          key="description"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Description"
          onChangeText={text => handleInputChange('description', text)}
          value={newTool.description || ''}
        />
        <TextInput
          key="materials"
          style={{borderWidth: 1, padding: 5, marginVertical: 10}}
          placeholder="Materials"
          onChangeText={text => handleInputChange('materials', text)}
          value={newTool.materials.toString() || [].toString()}
        />
      </>
    );
  };

  const renderTool = ({item}: {item: Tool}) => (
    <ListItem
      item={item}
      onDeleteItem={handleDeleteTool}
      onUpdateItem={handleUpdateTool}
    />
  );

  return (
    <>
      <FlatList
        data={tools}
        renderItem={renderTool}
        keyExtractor={item => item.id}
        style={{marginTop: 20}}
      />
      <Button
        color={'green'}
        title="+"
        onPress={() => setIsAddItemModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddItemModalVisible}
        style={{borderRadius: 10}}
        onRequestClose={() => setIsAddItemModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: 'white', padding: 20}}>
            <Text>Add New Tool</Text>
            {renderInputFields()}
            <Button title="Save" onPress={handleAddTool} />
            <Button
              title="Cancel"
              onPress={() => setIsAddItemModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ToolList;
